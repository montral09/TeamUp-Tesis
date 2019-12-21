using backend.Data_Access.Query;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Requests;
using backend.Exceptions;
using backend.Logic;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace backend.Data_Access
{
    public class DAOSpaces : IDAOSpaces
    {
        private QueryDAOSpaces cns;
        private const int RESERVATION_CANCELED_STATE = 5;
        private const int PUBLICATION_OFFICE = 1;
        private const int PUBLICATION_COWORKING = 2;
        private const int PUBLICATION_MEETING_ROOM = 3;
        private const int PUBLICATION_EVENTS = 4;
        private const int PLAN_GOLD = 4;
        private const int PLAN_SILVER = 3;
        private const int PLAN_BRONZE = 2;
        private const int PLAN_FREE = 1;
        private const int MAX_GOLD = 10;
        private const int MAX_SILVER = 5;
        private const int MAX_TOTAL = 15;
        private const int MIN_TOTAL = 5;

        public DAOSpaces()
        {
            cns = new QueryDAOSpaces();
        }
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }
    
        public List<VOSpaceType> GetSpaceTypes()
        {
            SqlConnection con = null;
            List<VOSpaceType> spaceTypes = new List<VOSpaceType>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetSpacesTypes();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOSpaceType voSpaceType;
                while (dr.Read())
                {
                    voSpaceType = new VOSpaceType(Convert.ToInt32(dr["idSpaceType"]), Convert.ToString(dr["description"]), Convert.ToBoolean(dr["individualRent"]));
                    spaceTypes.Add(voSpaceType);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return spaceTypes;
        }

        public List<VOReservationType> GetReservationTypes()
        {
            SqlConnection con = null;
            List<VOReservationType> reservationTypes = new List<VOReservationType>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetReservationTypes();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOReservationType voReservationType;
                while (dr.Read())
                {
                    voReservationType = new VOReservationType(Convert.ToInt32(dr["idReservationType"]), Convert.ToString(dr["description"]));
                    reservationTypes.Add(voReservationType);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return reservationTypes;
        }

        public List<VOFacility> GetFacilities()
        {
            SqlConnection con = null;
            List<VOFacility> facilities = new List<VOFacility>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetFacilities();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOFacility voFacility;
                while (dr.Read())
                {
                    voFacility = new VOFacility(Convert.ToInt32(dr["idFacility"]), Convert.ToString(dr["description"]), Convert.ToString(dr["icon"]));
                    facilities.Add(voFacility);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return facilities;
        }

        public async Task CreatePublicationAsync(VORequestCreatePublication voCreatePublication, User user)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                String query = cns.CreatePublication();
                String mail = voCreatePublication.VOPublication.Mail;
                String facilities = Util.CreateFacilitiesString(voCreatePublication.VOPublication.Facilities);
                DateTime expirationDate = CalculateExpirationDatePublication(voCreatePublication.VOPublication.IdPlan, con, objTrans);
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idUser", SqlDbType.VarChar) {Value = user.IdUser},
                        new SqlParameter("@spaceType", SqlDbType.Int) {Value = voCreatePublication.VOPublication.SpaceType},
                        new SqlParameter("@title", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Title},
                        new SqlParameter("@description", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Description},
                        new SqlParameter("@address", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Address},
                        new SqlParameter("@locationLat", SqlDbType.Decimal) {Value = voCreatePublication.VOPublication.Location.Latitude},
                        new SqlParameter("@locationLong", SqlDbType.Decimal) {Value = voCreatePublication.VOPublication.Location.Longitude},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = voCreatePublication.VOPublication.Capacity},
                        new SqlParameter("@videoURL", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.VideoURL},
                        new SqlParameter("@hourPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.HourPrice},
                        new SqlParameter("@dailyPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.DailyPrice},
                        new SqlParameter("@weeklyPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.WeeklyPrice},
                        new SqlParameter("@monthlyPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.MonthlyPrice},
                        new SqlParameter("@availability", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Availability},
                        new SqlParameter("@facilities", SqlDbType.VarChar) {Value = facilities},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.City},
                        new SqlParameter("@expirationDate", SqlDbType.DateTime) {Value = expirationDate}
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());                
                insertCommand.Transaction = objTrans;
                int idPublication = Convert.ToInt32(insertCommand.ExecuteScalar());
                // If Plan <> FREE, insert preferential payment
                if (voCreatePublication.VOPublication.IdPlan != 1)
                {
                    CreatePreferentialPayment(idPublication, voCreatePublication.VOPublication.IdPlan, con, objTrans);
                }
                // Store images
                StorageUtil storageUtil = new StorageUtil();
                List<string> urls = await storageUtil.StoreImageAsync(voCreatePublication.Images, user.IdUser, idPublication);
                InsertImages(con, objTrans, idPublication, urls);
                // Send email to publisher
                string subject = "Publication created";
                string body = Util.CreateBodyEmailNewPublicationToPublisher(user.Name);
                Util util = new Util();
                util.SendEmailAsync(mail, body, subject);
                // Send email to admin
                string adminEmail = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                string bodyAdmin = Util.CreateBodyEmailNewPublicationToAdmin(mail);
                util.SendEmailAsync(adminEmail, bodyAdmin, subject);                
                objTrans.Commit();
            }
            catch (Exception e)
            {
                objTrans.Rollback();
                objTrans.Dispose();
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private void CreatePreferentialPayment(int idPublication, int idPlan, SqlConnection con, SqlTransaction objTrans)
        {
            String query = cns.CreatePreferentialPayment();
            SqlCommand insertCommand = new SqlCommand(query, con);
            List<SqlParameter> prm = new List<SqlParameter>()
            {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPlan},                       
            };
            insertCommand.Parameters.AddRange(prm.ToArray());
            insertCommand.Transaction = objTrans;
            insertCommand.ExecuteNonQuery();
        }

        private DateTime CalculateExpirationDatePublication(int idPlan, SqlConnection con, SqlTransaction objTrans)
        {
            int days = 0;
            DateTime today = DateTime.Now;
            String query = cns.GetDaysPlan();
            SqlCommand selectCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idPlan",
                Value = idPlan,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            selectCommand.Transaction = objTrans;
            SqlDataReader dr = selectCommand.ExecuteReader();
            while (dr.Read())
            {
                days = Convert.ToInt32(dr["days"]);
            }
            dr.Close();
            return today.AddDays(days);
        }

        private void InsertImages(SqlConnection con, SqlTransaction objTrans, int idPublication, List<string> urls)
        {
            String query = cns.InsertImage();
            SqlCommand insertCommand = new SqlCommand(query, con);
            foreach (var item in urls)
            {
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                    new SqlParameter("@idPublication", SqlDbType.Int) { Value = idPublication },
                    new SqlParameter("@accessURL", SqlDbType.VarChar) { Value = item },
                };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.Transaction = objTrans;
                insertCommand.ExecuteNonQuery();
                insertCommand.Parameters.Clear();
            }
        }

        public List<VOPublicationAdmin> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval)
        {
            SqlConnection con = null;
            List<VOPublicationAdmin> publications = new List<VOPublicationAdmin>();
            string creationDateString;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationsPendingApproval();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublicationAdmin voPublication;
                while (dr.Read())
                {
 
                    List<String> images = new List<string>();                 
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    Util util = new Util();
                    List<int> facilities = util.ConvertFacilities(facilitiesString);
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    String queryImages = cns.GetImages();
                    SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                    SqlParameter parametro = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandImages.Parameters.Add(parametro);
                    SqlDataReader drImages = selectCommandImages.ExecuteReader();
                    while (drImages.Read()) {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    voPublication = new VOPublicationAdmin(Convert.ToInt32(dr["idPublication"]), Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]),
                         Convert.ToInt32(dr["spaceType"]), creationDateString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, TeamUpConstants.NOT_VALIDATED, Convert.ToString(dr["city"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]));
                    publications.Add(voPublication);                    
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return publications;
        }

        public List<VOPublication> GetPublisherSpaces(string mail)
        {
            SqlConnection con = null;
            List<VOPublication> publications = new List<VOPublication>();
            Util util = new Util();
            VOPreferentialPlan voPreferentialPlan;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublisherSpaces();
                SqlCommand selectCommand = new SqlCommand(query, con);              
                SqlParameter parametroMail = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametroMail);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublication voPublication;
                string creationDateString;
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    List<int> facilities = util.ConvertFacilities(facilitiesString);
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    int idPlan = Convert.ToInt32(dr["idPlan"]);
                    String queryImages = cns.GetImages();
                    SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                    SqlParameter parametro = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandImages.Parameters.Add(parametro);
                    SqlDataReader drImages = selectCommandImages.ExecuteReader();
                    while (drImages.Read())
                    {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<VOReview> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    int questionsWithoutAnswer = GetQuestionsWithoutAnswer(idPublication, con);
                    voPreferentialPlan = GetPreferentialPlanInfo(idPublication, idPlan, con);
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), null, null, null, null, Convert.ToInt32(dr["spaceType"]), creationDateString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, Convert.ToString(dr["state"]), 0, reviews, ranking, 0, false, questionsWithoutAnswer, false, idPlan, voPreferentialPlan);
                    publications.Add(voPublication);                   
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return publications;
        }

        private VOPayment GetCommissionPayment(int idReservation, SqlConnection con)
        {
            VOPayment voPayment = null;
            try
            {
                string paymentDateString = null;
                String query = cns.GetCommissionPayment();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = idReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    paymentDateString = null;
                    if (!(dr["paymentCommissionDate"] is DBNull))
                    {
                        DateTime paymentDate = Convert.ToDateTime(dr["paymentCommissionDate"]);
                        paymentDateString = Util.ConvertDateToString(paymentDate);
                    }                    
                    voPayment = new VOPayment(Convert.ToInt32(dr["commissionPaymentState"]), Convert.ToString(dr["description"]), Convert.ToString(dr["commissionComment"]), Convert.ToString(dr["commissionEvidence"]), paymentDateString, Convert.ToInt32(dr["commission"]));                        
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return voPayment;
        }

            private VOPreferentialPlan GetPreferentialPlanInfo(int idPublication, int idPlan, SqlConnection con)
        {
            VOPreferentialPlan voPreferentialPlan = null;
            try
            {                   
                string paymentDateString = null;
                String query = cns.GetPreferentialPlanInfo();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    //It is not a free plan 
                    while (dr.Read())
                    {
                        paymentDateString = null;
                        if (!(dr["paymentDate"] is DBNull))
                        {
                            DateTime paymentDate = Convert.ToDateTime(dr["paymentDate"]);
                            paymentDateString = Util.ConvertDateToString(paymentDate);
                        }
                        voPreferentialPlan = new VOPreferentialPlan(Convert.ToInt32(dr["idPlan"]), Convert.ToString(dr["planDescription"]), Convert.ToInt32(dr["state"]),
                                Convert.ToString(dr["paymentDescription"]), Convert.ToInt32(dr["price"]), paymentDateString);
                    }
                    dr.Close();
                } else
                {
                    // It's a free plan
                    String queryPlan = cns.GetPublicationPlanById();
                    SqlCommand selectCommandPlan = new SqlCommand(queryPlan, con);
                    SqlParameter paramPlan = new SqlParameter()
                    {
                        ParameterName = "@idPlan",
                        Value = idPlan,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandPlan.Parameters.Add(paramPlan);
                    SqlDataReader drPlan = selectCommandPlan.ExecuteReader();
                    string plan = "";
                    while (drPlan.Read())
                    {
                        plan = Convert.ToString(drPlan["name"]);
                    }
                    drPlan.Close();
                    voPreferentialPlan = new VOPreferentialPlan(idPlan, plan, 0, null, 0, null);                
                }
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return voPreferentialPlan;
            }

        public VOPublication GetSpace(int idSpace, User user)
        {
            VOPublication voPublication = null;
            SqlConnection con = null;
            string creationDateString;
            try
            {
                Util util = new Util();
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetSpace();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idSpace,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    List<int> facilities = util.ConvertFacilities(facilitiesString);
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    String queryImages = cns.GetImages();
                    SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                    SqlParameter parametroImages = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idSpace,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandImages.Parameters.Add(parametroImages);
                    SqlDataReader drImages = selectCommandImages.ExecuteReader();
                    while (drImages.Read())
                    {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<VOReview> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    int quantityRented = GetQuantityReserved(idPublication, con);
                    AddOneVisit(idPublication, con);
                    bool isMyPublication = user != null && user.IdUser == Convert.ToInt32(dr["idUser"]) ? true : false;
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), null, null, null, null, Convert.ToInt32(dr["spaceType"]), creationDateString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]), 
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null, quantityRented, reviews, ranking, Convert.ToInt32(dr["totalViews"]), Convert.ToBoolean(dr["individualRent"]), 0, isMyPublication, 0, null);                    
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return voPublication;
        }

        public void AddOneVisit(int idPublication, SqlConnection con)
        {
            try
            {
                String query = cns.AddOneVisit();
                SqlCommand updateCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                updateCommand.Parameters.Add(param);
                updateCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }            
        }

        public VOPublicationAdmin UpdateStatePublication(int idPublication, string rejectedReason, int newCodeState, bool isAdmin)
        {
            VOPublicationAdmin voPublication = null;
            SqlConnection con = null;
            string rejectedReasonAux = "";
            string creationDateString;
            if (rejectedReason != null)
            {
                rejectedReasonAux = rejectedReason;
            }            
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.UdpdateStatePublication(rejectedReason);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@state", SqlDbType.Int) {Value = newCodeState},
                        new SqlParameter("@rejectedReason", SqlDbType.VarChar) {Value = rejectedReasonAux},

                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
                if (isAdmin && (newCodeState == 2 || newCodeState == 6))
                {
                    String queryGetPublisher = cns.GetPublisherMailFromPublication();
                    SqlCommand selectCommand = new SqlCommand(queryGetPublisher, con);
                    SqlParameter param = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommand.Parameters.Add(param);
                    SqlDataReader dr = selectCommand.ExecuteReader();
                    while (dr.Read())
                    {
                        DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                        creationDateString = Util.ConvertDateToString(creationDate);
                        voPublication = new VOPublicationAdmin(idPublication, Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]),
                         0, creationDateString, Convert.ToString(dr["title"]),null, null,
                        null, 0, null, 0,
                        0, 0, 0, null, null, null, null, null, Convert.ToString(dr["name"]), null,null);
                    }
                    dr.Close();
                }                
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return voPublication;
        }

        public VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter)
        {
            VOResponseGetPublicationsWithFilters response = new VOResponseGetPublicationsWithFilters();
            List<VOPublication> publications = new List<VOPublication>();
            VOPublication voPublication = null;
            SqlConnection con = null;
            Util util = new Util();
            int state = 0;
            int MAX_PUBLICATIONS_PAGE = voGetPublicationsFilter.PublicationsPerPage;
            string creationDateString;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (voGetPublicationsFilter.State != null)
                {
                    state = util.ConvertState(voGetPublicationsFilter.State);
                }                    
                    int qty = 0;
                    String queryQuantity = cns.GetQuantityPublicationsWithFilter(voGetPublicationsFilter, state);
                    SqlCommand selectCommandQuantity = new SqlCommand(queryQuantity, con);
                    List<SqlParameter> prmQty = new List<SqlParameter>()
                    {
                        new SqlParameter("@spaceType", SqlDbType.Int) { Value = voGetPublicationsFilter.SpaceType},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = voGetPublicationsFilter.Capacity},
                        new SqlParameter("@state", SqlDbType.Int) {Value = state},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = voGetPublicationsFilter.City ?? ""},
                    };
                    selectCommandQuantity.Parameters.AddRange(prmQty.ToArray());
                    SqlDataReader drQty = selectCommandQuantity.ExecuteReader();
                    while (drQty.Read())
                    {
                        qty = Convert.ToInt32(drQty["quantity"]);
                    }
                    drQty.Close();
                    response.TotalPublications = qty;   
               
                String query = cns.GetPublicationsWithFilter(voGetPublicationsFilter, MAX_PUBLICATIONS_PAGE, state);
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                 {
                    new SqlParameter("@spaceType", SqlDbType.Int) { Value = voGetPublicationsFilter.SpaceType},
                    new SqlParameter("@capacity", SqlDbType.Int) {Value = voGetPublicationsFilter.Capacity},
                    new SqlParameter("@state", SqlDbType.Int) {Value = state},
                    new SqlParameter("@city", SqlDbType.VarChar) {Value = voGetPublicationsFilter.City ?? ""},
                };
                selectCommand.Parameters.AddRange(prm.ToArray());                
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    List<int> facilities = util.ConvertFacilities(facilitiesString);
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    String queryImages = cns.GetImages();
                    SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                    SqlParameter parametroImages = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandImages.Parameters.Add(parametroImages);
                    SqlDataReader drImages = selectCommandImages.ExecuteReader();
                    while (drImages.Read())
                    {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<VOReview> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    int quantityRented = GetQuantityReserved(idPublication, con);
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToInt32(dr["spaceType"]), creationDateString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null, quantityRented, reviews, ranking, Convert.ToInt32(dr["totalViews"]), Convert.ToBoolean(dr["individualRent"]), 0, false, 0, null);
                    publications.Add(voPublication);
                }                
                dr.Close();
                response.Publications = publications;
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return response;

        }

        public bool IsFavourite(int idPublication, long idUser)
        {
            SqlConnection con = null;
            try
            {
                bool isFavourite = false;
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetFavourite();
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@idUser", SqlDbType.Int) {Value = idUser}
                };
                selectCommand.Parameters.AddRange(prm.ToArray());
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    isFavourite = true;
                }
                dr.Close();
                return isFavourite;
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<VOReview> GetReviews (int idPublication, SqlConnection con)
        {
            List<VOReview> reviews = new List<VOReview>();
            try
            {
                String query = cns.GetReviews();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOReview voReview;
                while (dr.Read())
                {
                    voReview = new VOReview(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToInt32(dr["rating"]), Convert.ToString(dr["review"]), Convert.ToInt32(dr["idReservation"]));                   
                    reviews.Add(voReview);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }            
            return reviews;
        }

        public int GetQuantityReserved(int idPublication, SqlConnection con)
        {
            int qty = 0;
            try
            {
                String query = cns.GetQuantityReserved();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOReview voReview;
                while (dr.Read())
                {
                    qty = Convert.ToInt32(dr["quantity"]);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return qty;
        }


        public List<VOPublication> GetRelatedSpaces(int idPublication, int capacity, int spaceType, string city)
        {
            List<VOPublication> related = new List<VOPublication>();
            SqlConnection con = null;
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetRelatedSpaces();
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = capacity},
                        new SqlParameter("@spaceType", SqlDbType.Int) {Value = spaceType},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = city},
                };
                selectCommand.Parameters.AddRange(prm.ToArray());
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublication voPublication;
                string creationDateString;
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    List<int> facilities = util.ConvertFacilities(facilitiesString);
                    String queryImages = cns.GetImages();
                    SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                    SqlParameter parametroImages = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandImages.Parameters.Add(parametroImages);
                    SqlDataReader drImages = selectCommandImages.ExecuteReader();
                    while (drImages.Read())
                    {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<VOReview> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), null, null, null, null, Convert.ToInt32(dr["spaceType"]), creationDateString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null, 0, reviews, ranking, Convert.ToInt32(dr["totalViews"]), false, 0, false, 0, null);
                    related.Add(voPublication);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return related;
        }

        public void UpdateFavorite(VORequestUpdateFavorite voUpdateFavorite, long idUser)
        {
            SqlConnection con = null;            
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                string query = "";
                if (voUpdateFavorite.Code == 1)
                {
                    //Insert
                    query = cns.AddFavorite();

                } else
                {
                    query = cns.DeleteFavorite();
                }
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = voUpdateFavorite.IdPublication},
                        new SqlParameter("@idUser", SqlDbType.Int) {Value = idUser}
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public async Task UpdatePublication(VORequestUpdatePublication voUpdatePublication, User user)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            int idPublication = voUpdatePublication.Publication.IdPublication;
            StorageUtil storageUtil = new StorageUtil();
            string currentImagesURL = "";
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                string queryImages = "";
                //Step 1: delete images
                if (voUpdatePublication.ImagesURL == null)
                {
                    // If there is no URL, it means that all images were deleted
                    queryImages = cns.DeleteAllImages();
                } else
                {
                    currentImagesURL = StorageUtil.CreateImagesURLString(voUpdatePublication.ImagesURL);
                    // Some or none image were deleted
                    queryImages = cns.DeleteImages(currentImagesURL);
                }               
                List<SqlParameter> paramImages = new List<SqlParameter>()
                {
                     new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                     new SqlParameter("@currentImagesURL", SqlDbType.VarChar) {Value = currentImagesURL},
                };
                SqlCommand deleteCommand = new SqlCommand(queryImages, con);
                deleteCommand.Parameters.AddRange(paramImages.ToArray());
                deleteCommand.Transaction = objTrans;
                deleteCommand.ExecuteNonQuery();
                //Step 2: insert images
                if (voUpdatePublication.Base64Images != null)
                {
                    List<string> urls = await storageUtil.StoreImageAsync(voUpdatePublication.Base64Images, user.IdUser, idPublication);
                    InsertImages(con, objTrans, idPublication, urls);
                }               
                //Step 3: update publication
                string query = cns.UpdatePublication();
                String facilities = Util.CreateFacilitiesString(voUpdatePublication.Publication.Facilities);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@spaceType", SqlDbType.Int) {Value = voUpdatePublication.Publication.SpaceType},
                        new SqlParameter("@title", SqlDbType.VarChar) {Value = voUpdatePublication.Publication.Title},
                        new SqlParameter("@description", SqlDbType.VarChar) {Value = voUpdatePublication.Publication.Description},
                        new SqlParameter("@address", SqlDbType.VarChar) {Value = voUpdatePublication.Publication.Address},
                        new SqlParameter("@locationLat", SqlDbType.Decimal) {Value = voUpdatePublication.Publication.Location.Latitude},
                        new SqlParameter("@locationLong", SqlDbType.Decimal) {Value = voUpdatePublication.Publication.Location.Longitude},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = voUpdatePublication.Publication.Capacity},
                        new SqlParameter("@videoURL", SqlDbType.VarChar) {Value = voUpdatePublication.Publication.VideoURL},
                        new SqlParameter("@hourPrice", SqlDbType.Int) {Value = voUpdatePublication.Publication.HourPrice},
                        new SqlParameter("@dailyPrice", SqlDbType.Int) {Value = voUpdatePublication.Publication.DailyPrice},
                        new SqlParameter("@weeklyPrice", SqlDbType.Int) {Value = voUpdatePublication.Publication.WeeklyPrice},
                        new SqlParameter("@monthlyPrice", SqlDbType.Int) {Value = voUpdatePublication.Publication.MonthlyPrice},
                        new SqlParameter("@availability", SqlDbType.VarChar) {Value = voUpdatePublication.Publication.Availability},
                        new SqlParameter("@facilities", SqlDbType.VarChar) {Value = facilities},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = voUpdatePublication.Publication.City}
                    };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                objTrans.Commit();
            }
            catch (Exception e)
            {
                objTrans.Rollback();
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                    objTrans.Dispose();
                }
            }
        }

        public void CreateReservation(VORequestCreateReservation voCreateReservation, User user)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                String query = cns.CreateReservation();
                SqlCommand insertCommand = new SqlCommand(query, con);
                int commission = Convert.ToInt32(ConfigurationManager.AppSettings["COMMISSION"]);
                int reservationCommission = voCreateReservation.VOReservation.TotalPrice * commission / 100; 
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = voCreateReservation.VOReservation.IdPublication},
                        new SqlParameter("@idCustomer", SqlDbType.Int) {Value = user.IdUser},
                        new SqlParameter("@planSelected", SqlDbType.VarChar) {Value = voCreateReservation.VOReservation.PlanSelected},
                        new SqlParameter("@dateFrom", SqlDbType.DateTime) {Value = voCreateReservation.VOReservation.DateFrom},
                        new SqlParameter("@hourFrom", SqlDbType.VarChar) {Value = voCreateReservation.VOReservation.HourFrom},
                        new SqlParameter("@hourTo", SqlDbType.VarChar) {Value = voCreateReservation.VOReservation.HourTo},
                        new SqlParameter("@people", SqlDbType.Int) {Value = voCreateReservation.VOReservation.People},
                        new SqlParameter("@comment", SqlDbType.VarChar) {Value = voCreateReservation.VOReservation.Comment},
                        new SqlParameter("@totalPrice", SqlDbType.Int) {Value = voCreateReservation.VOReservation.TotalPrice},
                        new SqlParameter("@commission", SqlDbType.Int) {Value = reservationCommission}
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.Transaction = objTrans;
                insertCommand.ExecuteNonQuery();
                // Send email to publisher
                User publisher = GetPublisherByPublication(con, objTrans, voCreateReservation.VOReservation.IdPublication);
                string subject = "Reservation created";
                string body = Util.CreateBodyEmailNewReservationToPublisher(publisher.Name);
                Util util = new Util();
                util.SendEmailAsync(publisher.Mail, body, subject);
                // Send email to customer
                string bodyCustomer = Util.CreateBodyEmailNewReservationToCustomer(user.Name);
                util.SendEmailAsync(user.Mail, bodyCustomer, subject);
                objTrans.Commit();
            }
            catch (Exception e)
            {
                objTrans.Rollback();
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private User GetPublisherByPublication(SqlConnection con, SqlTransaction objTrans, object idPublication)
        {
            String query = cns.GetPublisherByPublication();
            SqlCommand selectCommand = new SqlCommand(query, con);
            User user = null;
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idPublication",
                Value = idPublication,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            selectCommand.Transaction = objTrans;
            SqlDataReader dr = selectCommand.ExecuteReader();
            while (dr.Read())
            {
                user = new User(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), null, Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), null, Convert.ToBoolean(dr["checkPublisher"]), null, null, null, Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]), Convert.ToBoolean(dr["active"]));
            }
            dr.Close();

            return user;
        }

        public List<VOReservationExtended> GetReservationsCustomer(VORequestGetReservationsCustomer voGetReservationsCustomer, long idCustomer)
        {
            List<VOReservationExtended> reservations = new List<VOReservationExtended>();
            VOReservationExtended voReservation = null;
            SqlConnection con = null;
            int idReservation = 0;
            bool wasReviewed = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();

                String query = cns.GetReservations(idCustomer, 0);
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                 {
                    ParameterName = "@idCustomer",
                    Value = idCustomer,
                    SqlDbType = SqlDbType.Int                    
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    idReservation = Convert.ToInt32(dr["idReservation"]);
                    wasReviewed = ReservationWasReviewed(idReservation, con);
                    VOPayment payment = GetReservationPaymentInfo(idReservation, con);
                    String dateConverted = Convert.ToDateTime(dr["dateFrom"]).ToString("dd-MM-yyyy");
                    voReservation = new VOReservationExtended(idReservation, Convert.ToString(dr["title"]), Convert.ToInt32(dr["idPublication"]),
                        Convert.ToString(voGetReservationsCustomer.Mail), Convert.ToString(dr["planSelected"]),
                        Convert.ToInt32(dr["reservedQty"] is DBNull ? 0 : dr["reservedQty"]), Convert.ToDateTime(dr["dateFrom"]), dateConverted,  Convert.ToString(dr["hourFrom"]),
                        Convert.ToString(dr["hourTo"]), Convert.ToInt32(dr["people"] is DBNull ? 0 : dr["people"]), Convert.ToString(dr["comment"]),
                        Convert.ToInt32(dr["totalPrice"]), Convert.ToInt32(dr["state"]), Convert.ToString(dr["description"]), Convert.ToBoolean(dr["individualRent"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), wasReviewed, payment, null);
                    reservations.Add(voReservation);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return reservations;

        }

        private VOPayment GetReservationPaymentInfo(int idReservation, SqlConnection con)
        {
            string query = cns.GetReservationPaymentInfo();
            SqlCommand selectCommand = new SqlCommand(query, con);
            VOPayment payment = null;
            string paymentDateString = null;
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idReservation",
                Value = idReservation,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            SqlDataReader dr = selectCommand.ExecuteReader();
            while (dr.Read())
            {
                paymentDateString = null;
                if (!(dr["paymentCustomerDate"] is DBNull))
                {
                    DateTime paymentDate = Convert.ToDateTime(dr["paymentCustomerDate"]);
                    paymentDateString = Util.ConvertDateToString(paymentDate);
                }
                payment = new VOPayment(Convert.ToInt32(dr["paymentCustomerState"]), Convert.ToString(dr["description"]), Convert.ToString(dr["paymentCustomerComment"]), Convert.ToString(dr["paymentCustomerEvidence"]), paymentDateString, 0);
            }            
            dr.Close();

            return payment;
        }

        public List<VOReservationExtended> GetReservationsPublisher(VORequestGetReservationsPublisher voGetReservationsPublisher, long idUser)
        {
            List<VOReservationExtended> reservations = new List<VOReservationExtended>();
            VOReservationExtended voReservation;
            SqlConnection con = null;
            int idReservation;
            bool wasReviewed;
            VOPayment payment;
            VOPayment paymentCommission;
            String dateConverted;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetReservations(0, idUser);
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublisher",
                    Value = idUser,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    idReservation = Convert.ToInt32(dr["idReservation"]);
                    wasReviewed = ReservationWasReviewed(Convert.ToInt32(dr["idReservation"]), con);
                    payment = GetReservationPaymentInfo(idReservation, con);
                    dateConverted = Convert.ToDateTime(dr["dateFrom"]).ToString("dd-MM-yyyy");
                    paymentCommission = GetCommissionPayment(idReservation, con);
                    voReservation = new VOReservationExtended(Convert.ToInt32(dr["idReservation"]), Convert.ToString(dr["title"]), Convert.ToInt32(dr["idPublication"]),
                        Convert.ToString(voGetReservationsPublisher.Mail), Convert.ToString(dr["planSelected"]),
                        Convert.ToInt32(dr["reservedQty"] is DBNull ? 0 : dr["reservedQty"]), Convert.ToDateTime(dr["dateFrom"]), dateConverted, Convert.ToString(dr["hourFrom"]),
                        Convert.ToString(dr["hourTo"]), Convert.ToInt32(dr["people"] is DBNull ? 0 : dr["people"]), Convert.ToString(dr["comment"]),
                        Convert.ToInt32(dr["totalPrice"]), Convert.ToInt32(dr["state"]), Convert.ToString(dr["description"]), Convert.ToBoolean(dr["individualRent"]), Convert.ToInt32(dr["hourPrice"]), 
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), wasReviewed, payment, paymentCommission);
                    reservations.Add(voReservation);
                }
                dr.Close();
  
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return reservations;

        }

        public void UpdateStateReservation(int idReservation, string canceledReason, int newCodeState, string newDescriptionState, bool isAdmin)
        {            
            SqlConnection con = null;
            SqlTransaction objTrans;
            string canceledReasonAux = "";
            if (canceledReason != null)
            {
                canceledReasonAux = canceledReason;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                String query = cns.UdpdateStateReservation(canceledReason);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                        new SqlParameter("@state", SqlDbType.Int) {Value = newCodeState},
                        new SqlParameter("@canceledReason", SqlDbType.VarChar) {Value = canceledReasonAux},

                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                if (RESERVATION_CANCELED_STATE == newCodeState)
                {
                    string queryCancelPayment = cns.CancelPaymentReservation();
                    SqlCommand updatePayment = new SqlCommand(queryCancelPayment, con);
                    SqlParameter paramUpdatePayment = new SqlParameter()
                    {
                        ParameterName = "@idReservation",
                        Value = idReservation,
                        SqlDbType = SqlDbType.Int
                    };
                    updatePayment.Parameters.Add(paramUpdatePayment);
                    updatePayment.Transaction = objTrans;
                    updatePayment.ExecuteNonQuery();
                }
                string queryUsers = cns.GetUsersByReservation();
                SqlCommand selectCommandUsers = new SqlCommand(queryUsers, con);
                string customerMail = null;
                string publisherMail = null;
                string customerName = null;
                string publisherName = null;
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = idReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommandUsers.Parameters.Add(param);
                selectCommandUsers.Transaction = objTrans;
                SqlDataReader dr = selectCommandUsers.ExecuteReader();
                while (dr.Read())
                {
                    customerMail = Convert.ToString(dr["cMail"]);
                    publisherMail = Convert.ToString(dr["pMail"]);
                    customerName = Convert.ToString(dr["cName"]);
                    publisherName = Convert.ToString(dr["pName"]);
                        
                }
                dr.Close();
                // Send email to publisher                
                string subject = "ATENCION: Cambio en reserva";
                string body = Util.CreateBodyEmailStateReservationToPublisher(publisherName, newDescriptionState, canceledReason);
                Util util = new Util();
                util.SendEmailAsync(publisherMail, body, subject);
                // Send email to customer
                string bodyCustomer = Util.CreateBodyEmailStateReservationToCustomer(customerName, newDescriptionState, canceledReason);
                util.SendEmailAsync(customerMail, bodyCustomer, subject);
                objTrans.Commit();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public void UpdateReservation(VORequestUpdateReservation voUpdateReservation)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                string query = cns.UpdateReservation();                
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = voUpdateReservation.IdReservation},
                    new SqlParameter("@dateFrom", SqlDbType.DateTime) {Value = voUpdateReservation.DateFrom},
                    new SqlParameter("@hourFrom", SqlDbType.VarChar) {Value = voUpdateReservation.HourFrom},
                    new SqlParameter("@hourTo", SqlDbType.VarChar) {Value = voUpdateReservation.HourTo},
                    new SqlParameter("@totalPrice", SqlDbType.Int) {Value = voUpdateReservation.TotalPrice}, 
                    new SqlParameter("@people", SqlDbType.Int) {Value = voUpdateReservation.People},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                string queryUsers = cns.GetUsersByReservation();
                SqlCommand selectCommandUsers = new SqlCommand(queryUsers, con);
                string customerMail = null;
                string publisherMail = null;
                string customerName = null;
                string publisherName = null;
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = voUpdateReservation.IdReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommandUsers.Parameters.Add(param);
                selectCommandUsers.Transaction = objTrans;
                SqlDataReader dr = selectCommandUsers.ExecuteReader();
                while (dr.Read())
                {
                    customerMail = Convert.ToString(dr["cMail"]);
                    publisherMail = Convert.ToString(dr["pMail"]);
                    customerName = Convert.ToString(dr["cName"]);
                    publisherName = Convert.ToString(dr["pName"]);

                }
                dr.Close();
                // Send email to publisher                
                string subject = "ATENCION: Cambio en reserva";
                string body = Util.CreateBodyEmailUpdateReservationToPublisher(publisherName);
                Util util = new Util();
                util.SendEmailAsync(publisherMail, body, subject);
                // Send email to customer
                string bodyCustomer = Util.CreateBodyEmailUpdateReservationToCustomer(customerName);
                util.SendEmailAsync(customerMail, bodyCustomer, subject);
                objTrans.Commit();
            }
            catch (Exception e)
            {
                objTrans.Rollback();
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                    objTrans.Dispose();
                }
            }
        }

        public void CreateReview(VORequestCreateReview voCreateReview, long idUser)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.CreateReview();
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {                    
                        new SqlParameter("@idReservation", SqlDbType.Int) {Value = voCreateReview.VOReview.IdReservation},
                        new SqlParameter("@idUser", SqlDbType.Int) {Value = idUser},
                        new SqlParameter("@rating", SqlDbType.VarChar) {Value = voCreateReview.VOReview.Rating},
                        new SqlParameter("@review", SqlDbType.VarChar) {Value = voCreateReview.VOReview.Review},                        
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public void CreatePublicationQuestion(VORequestCreatePublicationQuestion voCreatePublicationQuestion, long idUser)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.CreateQuestion();
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = voCreatePublicationQuestion.IdPublication},
                        new SqlParameter("@idUser", SqlDbType.Int) {Value = idUser},
                        new SqlParameter("@question", SqlDbType.VarChar) {Value = voCreatePublicationQuestion.Question},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public void CreatePublicationAnswer(VORequestCreatePublicationAnswer voCreatePublicationAnswer, long idUser)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.CreateAnswer();
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idQuestion", SqlDbType.Int) {Value = voCreatePublicationAnswer.IdQuestion},
                        new SqlParameter("@answer", SqlDbType.VarChar) {Value = voCreatePublicationAnswer.Answer},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<VOPublicationQuestion> GetPublicationQuestions(int idPublication)
        {
            List<VOPublicationQuestion> questions = new List<VOPublicationQuestion>();
            SqlConnection con = null;
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationQuestions();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublicationQuestion voQuestion;
                while (dr.Read())
                {
                    VOAnswer answer = null; ;
                    String queryAnswers = cns.GetAnswers();
                    SqlCommand selectCommandAnswers = new SqlCommand(queryAnswers, con);
                    SqlParameter paramAnswers = new SqlParameter()
                    {
                        ParameterName = "@idQuestion",
                        Value = Convert.ToInt32(dr["idQuestion"]),
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandAnswers.Parameters.Add(paramAnswers);
                    SqlDataReader drAnswer = selectCommandAnswers.ExecuteReader();
                    while (drAnswer.Read())
                    {
                        string creationDateAnswer = Util.ConvertDateToString(Convert.ToDateTime(drAnswer["creationDate"]));
                        answer = new VOAnswer(Convert.ToString(drAnswer["answer"]), creationDateAnswer);                        
                    }
                    drAnswer.Close();
                    string creationDate = Util.ConvertDateToString(Convert.ToDateTime(dr["creationDate"]));
                    voQuestion = new VOPublicationQuestion(Convert.ToInt32(dr["idQuestion"]), Convert.ToString(dr["name"]), Convert.ToString(dr["question"]), creationDate, answer);
                    questions.Add(voQuestion);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return questions;
        }

        public bool ReservationWasReviewed(int idReservation, SqlConnection con)
        {
            bool wasReviewed = false;
            try
            {                
                String query = cns.GetReviewReservation();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = idReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    wasReviewed = true;
                }

            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return wasReviewed;
        }

        public int GetQuestionsWithoutAnswer(int idPublication, SqlConnection con)
        {
            int qty = 0;
            try
            {
                String query = cns.GetQuestionsWithoutAnswer();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    qty = Convert.ToInt32(dr["qty"]);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return qty;
        }

        public List<VOPublicationPlan> GetPublicationPlans()
        {
            SqlConnection con = null;
            List<VOPublicationPlan> plans = new List<VOPublicationPlan>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationPlans();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublicationPlan voPlan;
                while (dr.Read())
                {
                    voPlan = new VOPublicationPlan(Convert.ToInt32(dr["idPlan"]), Convert.ToString(dr["name"]), Convert.ToInt32(dr["price"]), Convert.ToInt32(dr["days"]));
                    plans.Add(voPlan);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return plans;
        }

        public async Task UpdatePreferentialPayment(VORequestUpdatePreferentialPayment voUpdatePayment, bool isAdmin)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            StorageUtil storageUtil = new StorageUtil();
            string url = "";
            int idPlan = 2;
            string commentAux = "";                  
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                int idPayment = GetIdPreferentialPayment(voUpdatePayment.IdPublication, con, objTrans);
                if (isAdmin)
                {
                    int idPreferentialPlan = GetIdPreferentialPlan(idPayment, con, objTrans);
                    string query = cns.UpdatePreferentialPaymentAdmin();
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    SqlParameter prm = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = voUpdatePayment.IdPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    updateCommand.Parameters.Add(prm);
                    updateCommand.Transaction = objTrans;
                    updateCommand.ExecuteNonQuery();
                    string queryPubl = cns.UpdatePublicationDueToPayment();
                    SqlCommand updateCommandPubl = new SqlCommand(queryPubl, con);
                    DateTime expirationDatePublication = CalculateExpirationDatePublication(idPreferentialPlan, con, objTrans);
                    List<SqlParameter> prmPubl = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = voUpdatePayment.IdPublication},
                        new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPreferentialPlan},
                        new SqlParameter("@expirationDate", SqlDbType.DateTime) {Value = expirationDatePublication},
                    };
                    updateCommandPubl.Parameters.AddRange(prmPubl.ToArray());
                    updateCommandPubl.Transaction = objTrans;
                    updateCommandPubl.ExecuteNonQuery();

                    objTrans.Commit();
                } else
                {                    
                    if (voUpdatePayment.Evidence != null)
                    {
                        // Insert evidence
                        url = await storageUtil.StoreEvidencePaymentPlanAsync(voUpdatePayment.Evidence, idPayment, voUpdatePayment.IdPublication);
                    }
                    if (voUpdatePayment.Comment != null)
                    {
                        commentAux = voUpdatePayment.Comment;
                    }
                    string query = cns.UpdatePreferentialPayment(voUpdatePayment.Comment, url, idPlan);
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    List<SqlParameter> prm = new List<SqlParameter>()
                    {
                    new SqlParameter("@idPrefPayments", SqlDbType.Int) {Value = idPayment},
                    new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPlan},
                    new SqlParameter("@comment", SqlDbType.VarChar) {Value = commentAux},
                    new SqlParameter("@evidence", SqlDbType.VarChar) {Value = url},
                    };
                    updateCommand.Parameters.AddRange(prm.ToArray());
                    updateCommand.Transaction = objTrans;
                    updateCommand.ExecuteNonQuery();
                    objTrans.Commit();
                }
               
            }
            catch (Exception e)
            {
                objTrans.Rollback();
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                    objTrans.Dispose();
                }
            } 
        }

        private int GetIdPreferentialPayment(int idPreferentialPayment, SqlConnection con, SqlTransaction objTrans)
        {
            int id = 0;
            try
            {
                String query = cns.GetIdPreferentialPayment();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPreferentialPayment,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                selectCommand.Transaction = objTrans;
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    id = Convert.ToInt32(dr["idPrefPayments"]);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return id;
        }

        private int GetIdPreferentialPlan(int idPayment, SqlConnection con, SqlTransaction objTrans)
        {
            int id = 0;
            try
            {
                String query = cns.GetIdPreferentialPlan();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPrefPayments",
                    Value = idPayment,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                selectCommand.Transaction = objTrans;
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    id = Convert.ToInt32(dr["idPlan"]);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return id;
        }

        public async Task PayReservationCustomer(VORequestPayReservationCustomer voPayReservationCustomer, long idUser)
        {
            SqlConnection con = null;
            StorageUtil storageUtil = new StorageUtil();
            string url = "";
            string commentAux = "";
            if (voPayReservationCustomer.Comment != null)
            {
                commentAux = voPayReservationCustomer.Comment;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (voPayReservationCustomer.Evidence != null)
                {
                    // Insert evidence
                    url = await storageUtil.StoreEvidencePaymentReservationCustomerAsync(voPayReservationCustomer.Evidence, idUser, voPayReservationCustomer.IdReservation);
                }
                string query = cns.PayReservationCustomer(voPayReservationCustomer.Comment, url);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = voPayReservationCustomer.IdReservation},
                    new SqlParameter("@comment", SqlDbType.VarChar) {Value = commentAux},
                    new SqlParameter("@evidence", SqlDbType.VarChar) {Value = url},
                    };
                updateCommand.Parameters.AddRange(prm.ToArray());               
                updateCommand.ExecuteNonQuery();
                VOUserBasicData user = GetPublisherFromReservation(voPayReservationCustomer.IdReservation, con);
                // Send email to publisher
                string subject = "Reserva paga";
                string body = Util.CreateBodyEmailNewPublicationToPublisher(user.Name);
                Util util = new Util();
                util.SendEmailAsync(user.Mail, body, subject);
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private VOUserBasicData GetPublisherFromReservation(int idReservation, SqlConnection con)
        {
            VOUserBasicData user = null;
            try
            {
                String query = cns.GetPublisherFromReservation();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = idReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    user = new VOUserBasicData(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]));
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return user;
        }

        public async Task PayReservationPublisher(VORequestPayReservationPublisher voPayReservationPublisher, long idUser, bool isAdmin)
        {
            SqlConnection con = null;
            StorageUtil storageUtil = new StorageUtil();
            string url = "";
            string commentAux = "";
            if (voPayReservationPublisher.Comment != null)
            {
                commentAux = voPayReservationPublisher.Comment;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (isAdmin)
                {
                    string query = cns.ApproveCommissionPaymentPublisher();
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    SqlParameter prm = new SqlParameter()
                    {
                        ParameterName = "@idReservation",
                        Value = voPayReservationPublisher.IdReservation,
                        SqlDbType = SqlDbType.Int
                    };
                    updateCommand.Parameters.Add(prm);
                    updateCommand.ExecuteNonQuery();
                    VOUserBasicData user = GetPublisherFromReservation(voPayReservationPublisher.IdReservation, con);
                    // Send email to publisher
                    string subject = "Pago aprobado";
                    string body = Util.CreateBodyEmailApproveCommissionToPublisher(user.Name);
                    Util util = new Util();
                    util.SendEmailAsync(user.Mail, body, subject);
                }
                else
                {
                    if (voPayReservationPublisher.Evidence != null)
                    {
                        // Insert evidence
                        url = await storageUtil.StoreEvidencePaymentReservationPublisherAsync(voPayReservationPublisher.Evidence, idUser, voPayReservationPublisher.IdReservation);
                    }
                    string query = cns.PayReservationPublisher(voPayReservationPublisher.Comment, url);
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    List<SqlParameter> prm = new List<SqlParameter>()
                        {
                        new SqlParameter("@idReservation", SqlDbType.Int) {Value = voPayReservationPublisher.IdReservation},
                        new SqlParameter("@comment", SqlDbType.VarChar) {Value = commentAux},
                        new SqlParameter("@evidence", SqlDbType.VarChar) {Value = url},
                        };
                    updateCommand.Parameters.AddRange(prm.ToArray());
                    updateCommand.ExecuteNonQuery();
                    // Send email to admin
                    Util util = new Util();
                    string subject = "Reserva paga";
                    string adminEmail = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                    string bodyAdmin = Util.CreateBodyEmailPayCommissionToAdmin(voPayReservationPublisher.Mail);
                    util.SendEmailAsync(adminEmail, bodyAdmin, subject);
                }
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public void ApprovePaymentCustomer(VORequestApprovePaymentCustomer voApprovePayment)
        {
            SqlConnection con = null;        
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();                
                string query = cns.ApprovePaymentCustomer();
                SqlCommand updateCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = voApprovePayment.IdReservation,
                    SqlDbType = SqlDbType.Int
                };
                updateCommand.Parameters.Add(param);
                updateCommand.ExecuteNonQuery();
                VOUserBasicData user = GetCustomerFromReservation(voApprovePayment.IdReservation, con);
                // Send email to customer
                string subject = "Pago de reserva confirmado";
                string body = Util.CreateBodyEmailUpdatePaymentCustomer(user.Name);
                Util util = new Util();
                util.SendEmailAsync(user.Mail, body, subject);
                
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private VOUserBasicData GetCustomerFromReservation(int idReservation, SqlConnection con)
        {
            VOUserBasicData user = null;
            try
            {
                String query = cns.GetCustomerFromReservation();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = idReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    user = new VOUserBasicData(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]));
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return user;
        }

        public List<VOPublicationPaymentAdmin> GetPublicationPlanPayments()
        {
            SqlConnection con = null;
            List<VOPublicationPaymentAdmin> payments = new List<VOPublicationPaymentAdmin>();
            string paymentDateString = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationPlanPayments();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublicationPaymentAdmin voPayment;
                while (dr.Read())
                {
                    paymentDateString = null;
                    if (dr["paymentDate"] != DBNull.Value)
                    {
                        paymentDateString = Util.ConvertDateToString(Convert.ToDateTime(dr["paymentDate"]));
                    }                                                          
                    voPayment = new VOPublicationPaymentAdmin(Convert.ToInt32(dr["idPublication"]), Convert.ToString(dr["title"]), Convert.ToString(dr["mail"]),
                         Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["planName"]),
                         Convert.ToString(dr["description"]), Convert.ToInt32(dr["price"]), Convert.ToString(dr["comment"]),
                         Convert.ToString(dr["evidence"]), paymentDateString);
                    payments.Add(voPayment);
                } 
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return payments;
        }

        public List<VOCommissionPaymentAdmin> GetCommissionPaymentsAdmin()
        {
            SqlConnection con = null;
            List<VOCommissionPaymentAdmin> commissions = new List<VOCommissionPaymentAdmin>();
            string paymentDateString = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetCommissionPaymentsAdmin();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOCommissionPaymentAdmin voCommission;
                while (dr.Read())
                {
                    paymentDateString = null;
                    if (dr["paymentCommissionDate"] != DBNull.Value)
                    {
                        paymentDateString = Util.ConvertDateToString(Convert.ToDateTime(dr["paymentCommissionDate"]));
                    }
                    voCommission = new VOCommissionPaymentAdmin(Convert.ToInt32(dr["idReservation"]), Convert.ToString(dr["title"]), Convert.ToString(dr["mail"]),
                         Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToInt32(dr["commission"]),
                         Convert.ToString(dr["description"]), Convert.ToString(dr["commissionComment"]),
                         Convert.ToString(dr["commissionEvidence"]), paymentDateString);
                    commissions.Add(voCommission);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return commissions;
        }

        public List<VOPublication> GetFavorites(long idUser)
        {
            SqlConnection con = null;
            List<VOPublication> favorites = new List<VOPublication>();
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetFavorites();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idUser",
                    Value = idUser,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublication voPublication;
                while (dr.Read())
                {
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    List<VOReview> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    voPublication = new VOPublication(idPublication, Convert.ToInt32(dr["spaceType"]), Convert.ToString(dr["title"]), Convert.ToString(dr["city"]),
                        Convert.ToString(dr["address"]), Convert.ToInt32(dr["capacity"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), ranking);                    
                    favorites.Add(voPublication);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return favorites;
        }

        public List<VOSpaceTypeRecommended> GetRecommendedPublications()
        {            
            SqlConnection con = null;
            List<VOSpaceTypeRecommended> recommendedList = new List<VOSpaceTypeRecommended>();
            VOSpaceTypeRecommended recommended;
            List<VORecommended> offices;
            List<VORecommended> coworking;
            List<VORecommended> meetingRooms;
            List<VORecommended> events;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationsRecommended();
                offices = GetRecommendedSpaceType(query, con, PUBLICATION_OFFICE);
                recommended = new VOSpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_OFFICE,
                    Publications = offices
                };
                recommendedList.Add(recommended);
                coworking = GetRecommendedSpaceType(query, con, PUBLICATION_COWORKING);
                recommended = new VOSpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_COWORKING,
                    Publications = coworking
                };
                recommendedList.Add(recommended);
                meetingRooms = GetRecommendedSpaceType(query, con, PUBLICATION_MEETING_ROOM);
                recommended = new VOSpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_MEETING_ROOM,
                    Publications = meetingRooms
                };
                recommendedList.Add(recommended);
                events = GetRecommendedSpaceType(query, con, PUBLICATION_EVENTS);
                recommended = new VOSpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_EVENTS,
                    Publications = events
                };
                recommendedList.Add(recommended);
            }
            catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return recommendedList;
        }

        private List<VORecommended> GetRecommendedSpaceType(string query, SqlConnection con, int spaceType)
        {
            List<VORecommended> spaceTypeList = new List<VORecommended>(MAX_TOTAL);
            List<VORecommended> spaceTypeListAux = new List<VORecommended>();
            VORecommended voPublication;            
            try
            {
                SqlDataReader dr;
                //GOLD
                SqlCommand selectCommandGold = new SqlCommand(query, con);
                List<SqlParameter> prmGold = new List<SqlParameter>()
                {
                new SqlParameter("@spaceType", SqlDbType.Int) {Value = spaceType},
                new SqlParameter("@idPlan", SqlDbType.VarChar) {Value = PLAN_GOLD},
                };
                selectCommandGold.Parameters.AddRange(prmGold.ToArray());
                dr = selectCommandGold.ExecuteReader();
                while (dr.Read())
                {
                    voPublication = BuildRecommended(dr, con);
                    spaceTypeListAux.Add(voPublication);
                }
                dr.Close();
                int addedSilver = 0;
                if (spaceTypeListAux.Count != 0)
                {
                    // Sort randomic gold
                    spaceTypeListAux = Util.ShuffleRecommended(spaceTypeListAux);
                    if (spaceTypeListAux.Count < MAX_GOLD)
                    {
                        addedSilver = MAX_GOLD - spaceTypeListAux.Count;
                    }
                    else
                    {
                        spaceTypeListAux.GetRange(0, MAX_GOLD - 1);
                    }
                    spaceTypeList.AddRange(spaceTypeListAux);
                    spaceTypeListAux.Clear();
                } else
                {
                    addedSilver = MAX_GOLD;
                }
                
                
                //SILVER
                SqlCommand selectCommandSilver = new SqlCommand(query, con);
                List<SqlParameter> prmSilver= new List<SqlParameter>()
                {
                new SqlParameter("@spaceType", SqlDbType.Int) {Value = spaceType},
                new SqlParameter("@idPlan", SqlDbType.VarChar) {Value = PLAN_SILVER},
                };
                selectCommandSilver.Parameters.AddRange(prmSilver.ToArray());
                dr = selectCommandSilver.ExecuteReader();
                while (dr.Read())
                {
                    voPublication = BuildRecommended(dr, con);
                    spaceTypeListAux.Add(voPublication);
                }
                dr.Close();
                if (spaceTypeListAux.Count != 0)
                {
                    // Sort randomic silver
                    spaceTypeListAux = Util.ShuffleRecommended(spaceTypeListAux);
                    if (spaceTypeListAux.Count < MAX_SILVER + addedSilver)
                    {
                        spaceTypeList.AddRange(spaceTypeListAux);                        
                    }
                    else
                    {
                        spaceTypeList.AddRange(spaceTypeListAux.GetRange(0, MAX_SILVER - 1));                        
                    }                    
                    spaceTypeListAux.Clear();
                }                

                //BRONZE
                if (spaceTypeList.Count < MIN_TOTAL)
                {
                    SqlCommand selectCommandBronze = new SqlCommand(query, con);
                    List<SqlParameter> prmBronze = new List<SqlParameter>()
                    {
                    new SqlParameter("@spaceType", SqlDbType.Int) {Value = spaceType},
                    new SqlParameter("@idPlan", SqlDbType.VarChar) {Value = PLAN_BRONZE},
                    };
                    selectCommandBronze.Parameters.AddRange(prmBronze.ToArray());
                    dr = selectCommandBronze.ExecuteReader();
                    while (dr.Read())
                    {
                        voPublication = BuildRecommended(dr, con);
                        spaceTypeListAux.Add(voPublication);
                    }
                    dr.Close();
                    if (spaceTypeListAux.Count != 0)
                    {
                        // Sort randomic bronze
                        spaceTypeListAux = Util.ShuffleRecommended(spaceTypeListAux);
                        int spacesLeft = MIN_TOTAL - spaceTypeList.Count;
                        if (spaceTypeListAux.Count <= spacesLeft)
                        {
                            spaceTypeList.AddRange(spaceTypeListAux);
                        }
                        else
                        {
                            spaceTypeList.AddRange(spaceTypeListAux.GetRange(0, spacesLeft));
                        }
                        spaceTypeListAux.Clear();
                    }
                }
                

                if (spaceTypeList.Count < MIN_TOTAL)
                {
                    //FREE
                    String queryFree = cns.GetPublicationsRecommendedFree();
                    SqlCommand selectCommandFree = new SqlCommand(queryFree, con);
                    SqlParameter prmFree = new SqlParameter()
                    {
                        ParameterName = "@spaceType",
                        Value = spaceType,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandFree.Parameters.Add(prmFree);
                    dr = selectCommandFree.ExecuteReader();
                    while (dr.Read())
                    {
                        voPublication = BuildRecommended(dr, con);
                        spaceTypeListAux.Add(voPublication);
                    }
                    dr.Close();
                    if (spaceTypeListAux.Count != 0)
                    {
                        // Sort randomic free
                        spaceTypeListAux = Util.ShuffleRecommended(spaceTypeListAux);
                        int spacesLeft = MIN_TOTAL - spaceTypeList.Count;
                        if (spaceTypeListAux.Count <= spacesLeft)
                        {
                            spaceTypeList.AddRange(spaceTypeListAux);
                        }
                        else
                        {                            
                            spaceTypeList.AddRange(spaceTypeListAux.GetRange(0, spacesLeft));
                        }
                        spaceTypeListAux.Clear();
                    }                    
                }
                
            } catch (Exception e)
            {
                if (con != null)
                {
                    con.Close();
                } 
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return spaceTypeList;
        }

        private VORecommended BuildRecommended(SqlDataReader dr, SqlConnection con)
        {
            VORecommended voPublication;
            List<string> images;
            int idPublication = Convert.ToInt32(dr["idPublication"]);
            images = GetImages(idPublication, con);
            voPublication = new VORecommended(idPublication, Convert.ToString(dr["title"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                Convert.ToInt32(dr["capacity"]), images);
            return voPublication;
        }

        private List<String> GetImages (int idPublication, SqlConnection con)
        {
            List<String> images = new List<String>();
            String queryImages = cns.GetImages();
            SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
            SqlParameter parametro = new SqlParameter()
            {
                ParameterName = "@idPublication",
                Value = idPublication,
                SqlDbType = SqlDbType.Int
            };
            selectCommandImages.Parameters.Add(parametro);
            SqlDataReader drImages = selectCommandImages.ExecuteReader();
            while (drImages.Read())
            {
                string accessURL = Convert.ToString(drImages["accessURL"]);
                images.Add(accessURL);
            }
            drImages.Close();
            return images;
        }
    }    
}
