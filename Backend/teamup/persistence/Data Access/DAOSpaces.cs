using backend.Data_Access.Query;
using backend.Exceptions;
using backend.Logic;
using backend.Logic.Entities;
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
        private const int PAYMENT_PAID_STATE = 3;
        private const int PAYMENT_REJECTED_STATE = 5;
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
        private DateTime DEFAULT_DATE_TIME = new DateTime();
        private const int PUBLICATION_ACTIVE_STATE = 2;

        public DAOSpaces()
        {
            cns = new QueryDAOSpaces();
        }
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }

        /// <summary>
        /// Returns all spaces types
        /// </summary>
        /// <returns>  Spaces types </returns>
        public List<SpaceType> GetSpaceTypes()
        {
            SqlConnection con = null;
            List<SpaceType> spaceTypes = new List<SpaceType>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetSpacesTypes();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                SpaceType spaceType;
                while (dr.Read())
                {
                    spaceType = new SpaceType(Convert.ToInt32(dr["idSpaceType"]), Convert.ToString(dr["description"]), Convert.ToBoolean(dr["individualRent"]));
                    spaceTypes.Add(spaceType);
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

        /// <summary>
        /// Returns all facilities
        /// </summary>
        /// <returns> Facilities </returns>
        public List<Facility> GetFacilities()
        {
            SqlConnection con = null;
            List<Facility> facilities = new List<Facility>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetFacilities();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                Facility facility;
                while (dr.Read())
                {
                    facility = new Facility(Convert.ToInt32(dr["idFacility"]), Convert.ToString(dr["description"]), Convert.ToString(dr["icon"]));
                    facilities.Add(facility);
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

        /// <summary>
        /// Creates an publication (child or parent) and calculates its expiration date
        /// </summary>
        /// <param name="publication"></param>
        /// <param name="user"></param>
        /// <param name="images"></param>
        /// <param name="imagesURL"></param>
        /// <returns> Date to and price that has to be paid by publisher</returns>
        public async Task<Dictionary<string, string>> CreatePublicationAsync(Publication publication, User user, List<Image> images, List<String> imagesURL)
        {
            Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            string expirationDateString = "";
            int prefPlanPrice = 0;
            StorageUtil storageUtil = new StorageUtil();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                String query = cns.CreatePublication();
                DateTime expirationDate = CalculateExpirationDatePublication(publication.IdPlan, con, objTrans);
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idUser", SqlDbType.VarChar) {Value = user.IdUser},
                        new SqlParameter("@spaceType", SqlDbType.Int) {Value = publication.SpaceType},
                        new SqlParameter("@title", SqlDbType.VarChar) {Value = publication.Title},
                        new SqlParameter("@description", SqlDbType.VarChar) {Value = publication.Description},
                        new SqlParameter("@address", SqlDbType.VarChar) {Value = publication.Address},
                        new SqlParameter("@locationLat", SqlDbType.Decimal) {Value = publication.Location.Latitude},
                        new SqlParameter("@locationLong", SqlDbType.Decimal) {Value = publication.Location.Longitude},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = publication.Capacity},
                        new SqlParameter("@videoURL", SqlDbType.VarChar) {Value = publication.VideoURL},
                        new SqlParameter("@hourPrice", SqlDbType.Int) {Value = publication.HourPrice},
                        new SqlParameter("@dailyPrice", SqlDbType.Int) {Value = publication.DailyPrice},
                        new SqlParameter("@weeklyPrice", SqlDbType.Int) {Value = publication.WeeklyPrice},
                        new SqlParameter("@monthlyPrice", SqlDbType.Int) {Value = publication.MonthlyPrice},
                        new SqlParameter("@availability", SqlDbType.VarChar) {Value = publication.Availability},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = publication.City},
                        new SqlParameter("@expirationDate", SqlDbType.DateTime) {Value = expirationDate}
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.Transaction = objTrans;
                int idPublication = Convert.ToInt32(insertCommand.ExecuteScalar());
                foreach (var facility in publication.Facilities)
                {
                    InsertFacility(idPublication, facility, con, objTrans);
                }

                //Check if it is a "child publication"
                if (publication.IdParentPublication != 0)
                {
                    String queryChildPublication = cns.CreateChildPublication();
                    SqlCommand insertChildPublication = new SqlCommand(queryChildPublication, con);
                    List<SqlParameter> param = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.VarChar) {Value = publication.IdParentPublication},
                        new SqlParameter("@idChildPublication", SqlDbType.Int) {Value = idPublication},
                    };
                    insertChildPublication.Parameters.AddRange(param.ToArray());
                    insertChildPublication.Transaction = objTrans;
                    insertChildPublication.ExecuteNonQuery();
                    if (imagesURL != null && imagesURL.Count != 0)
                    {                        
                        InsertImages(con, objTrans, idPublication, imagesURL);
                    }
                }
                bool isFreePreferentialPlan = IsFreePreferentialPlan(publication.IdPlan, con, objTrans);
                // If Plan <> FREE, insert preferential payment
                if (!isFreePreferentialPlan)
                {
                    if (publication.IdParentPublication != 0)
                    {
                        // If parent publication preferential payment is approved, copy preferential payment to child
                        bool parentPrefentialPlanApproved = ParentPrefentialPlanApproved(publication.IdParentPublication, con, objTrans);
                        if (parentPrefentialPlanApproved)
                        {
                            prefPlanPrice = CreatePreferentialPayment(idPublication, publication.IdParentPublication, publication.IdPlan, con, objTrans);
                        }
                    }
                    else
                    {
                        prefPlanPrice = CreatePreferentialPayment(idPublication, publication.IdParentPublication, publication.IdPlan, con, objTrans);
                    }

                }
                // Store images                
                List<string> urls = await storageUtil.StoreImageAsync(images, user.IdUser, idPublication);
                InsertImages(con, objTrans, idPublication, urls);
                objTrans.Commit();
                if (publication.IdParentPublication != 0)
                {
                    // Set state as active
                    UpdateStatePublication(idPublication, null, PUBLICATION_ACTIVE_STATE, false);
                }
                expirationDateString = Util.ConvertDateToString(expirationDate);
                keyValuePairs[ParamCodes.DATE_TO] = expirationDateString;
                keyValuePairs[ParamCodes.PRICE] = prefPlanPrice.ToString(); ;
                return keyValuePairs;
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
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

        /// <summary>
        /// Returns if parent publication preferential payments has been approved
        /// </summary>
        /// <param name="idParentPublication"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> true if it has been approved </returns>
        private bool ParentPrefentialPlanApproved(int idParentPublication, SqlConnection con, SqlTransaction objTrans)
        {
            bool idApproved = false;
            String query = cns.GetPublicationPlanApproved();
            SqlCommand selectCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idParentPublication",
                Value = idParentPublication,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            selectCommand.Transaction = objTrans;
            SqlDataReader dr = selectCommand.ExecuteReader();
            if (dr.HasRows)
            {
                idApproved = true;
            }
            dr.Close();
            return idApproved;
        }

        /// <summary>
        /// Creates a facility to given publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="idFacility"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        private void InsertFacility(int idPublication, int idFacility, SqlConnection con, SqlTransaction objTrans)
        {
            String query = cns.InsertFacility();
            SqlCommand insertCommand = new SqlCommand(query, con);
            List<SqlParameter> prm = new List<SqlParameter>()
            {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@idFacility", SqlDbType.Int) {Value = idFacility},
            };
            insertCommand.Parameters.AddRange(prm.ToArray());
            insertCommand.Transaction = objTrans;
            insertCommand.ExecuteNonQuery();
        }

        /// <summary>
        /// Given an idPlan return if it is a free plan
        /// </summary>
        /// <param name="idPlan"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> true if it is a free plan </returns>
        private bool IsFreePreferentialPlan(int idPlan, SqlConnection con, SqlTransaction objTrans)
        {
            bool isFree = false;
            String query = cns.GetFreePlan();
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
            if (dr.HasRows)
            {
                isFree = true;
            }
            dr.Close();
            return isFree;
        }

        /// <summary>
        /// Inserts a preferential publication payment
        /// If it is a child publication, inherits parent payment state, otherwise
        /// payment state is pending payment
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="idParentPublication"></param>
        /// <param name="idPlan"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns></returns>
        private int CreatePreferentialPayment(int idPublication, int idParentPublication, int idPlan, SqlConnection con, SqlTransaction objTrans)
        {
            if (idParentPublication != 0)
            {
                //Inherits parent preferential payment state
                String queryInheritPayment = cns.CreatePreferentialPaymentInherited();
                SqlCommand insertCommand = new SqlCommand(queryInheritPayment, con);
                List<SqlParameter> param = new List<SqlParameter>()
                {
                new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                new SqlParameter("@idParentPublication", SqlDbType.Int) {Value = idParentPublication},
                new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPlan},
                };
                insertCommand.Parameters.AddRange(param.ToArray());
                insertCommand.Transaction = objTrans;
                insertCommand.ExecuteNonQuery();
            }
            else
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
            PreferentialPlan prefPlan = GetPreferentialPlanInfo(idPublication, con, objTrans);
            if (idParentPublication != 0)
            {
                prefPlan.Price = 0;
            }
            SetPreferentialPlanPrice(idPublication, idPlan, prefPlan.Price, con, objTrans);
            return prefPlan.Price;
        }

        /// <summary>
        /// Calculates date to of a preferential plan
        /// </summary>
        /// <param name="idPlan"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Date to </returns>
        private DateTime CalculateExpirationDatePublication(int idPlan, SqlConnection con, SqlTransaction objTrans)
        {
            int days = 0;
            DateTime today = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.Now, TimeZoneInfo.Local.Id, "Montevideo Standard Time");
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

        /// <summary>
        /// Insert images urls for a publication
        /// </summary>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <param name="idPublication"></param>
        /// <param name="urls"></param>
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

        /// <summary>
        /// Returns all publication that has not been approved yet
        /// </summary>
        /// <returns> Publications pending approval </returns>
        public List<Publication> GetPublicationsPendingApproval()
        {
            SqlConnection con = null;
            List<Publication> publications = new List<Publication>();
            string creationDateString;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationsPendingApproval();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                Publication publication;
                while (dr.Read())
                {

                    List<String> images = new List<string>();
                    Util util = new Util();
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    List<int> facilities = GetFacilitiesPublication(idPublication, con);
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
                    LocationCordinates location = new LocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    publication = new Publication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]),
                         Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToInt32(dr["spaceType"]), creationDateString, null, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        location, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, TeamUpConstants.NOT_VALIDATED, 0, null, 0,
                        Convert.ToString(dr["city"]), 0, false, 0, false, 0, null, false, 0, false);
                    publications.Add(publication);
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
            return publications;
        }

        /// <summary>
        /// Given a publication, returns its facilities
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> facilities id</returns>
        private List<int> GetFacilitiesPublication(int idPublication, SqlConnection con)
        {
            List<int> facilities = new List<int>();
            String query = cns.GetFacilitiesPublication();
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
                facilities.Add(Convert.ToInt32(dr["idFacility"]));
            }
            dr.Close();
            return facilities;
        }

        /// <summary>
        /// Returns all publisher publications
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> Publications </returns>
        public List<Publication> GetPublisherSpaces(string mail)
        {
            SqlConnection con = null;
            List<Publication> publications = new List<Publication>();
            Util util = new Util();
            PreferentialPlan preferentialPlan;
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
                Publication publication;
                string creationDateString;
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    List<int> facilities = GetFacilitiesPublication(idPublication, con);
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
                    LocationCordinates location = new LocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<Review> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    int questionsWithoutAnswer = GetQuestionsWithoutAnswer(idPublication, con);
                    preferentialPlan = GetPreferentialPlanInfo(idPublication, con, null);
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    DateTime dateTo = Convert.ToDateTime(dr["expirationDate"]);
                    String dateToString = Util.ConvertDateToString(dateTo);
                    bool isChildPublication = IsChildPublication(idPublication);
                    publication = new Publication(Convert.ToInt32(dr["idPublication"]), 0, null, null, null, null, Convert.ToInt32(dr["spaceType"]), creationDateString, dateToString,
                        Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        location, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]),
                        facilities, images, Convert.ToString(dr["state"]), 0, reviews, ranking, Convert.ToString(dr["city"]),
                        Convert.ToInt32(dr["totalViews"]), false, questionsWithoutAnswer, false, idPlan, preferentialPlan, false, 0, isChildPublication);
                    publications.Add(publication);
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
            return publications;
        }

        /// <summary>
        /// Given a publication returns if it is a child publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <returns> true if publication has a parent publication </returns>
        private bool IsChildPublication(int idPublication)
        {
            bool isChild = false;
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.IsChildPublication();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idChildPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    isChild = true;
                }
                dr.Close();
                return isChild;
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

        /// <summary>
        /// Return commission info of a reservation
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="con"></param>
        /// <returns> Commission payment info </returns>
        private Payment GetCommissionPayment(int idReservation, SqlConnection con)
        {
            Payment payment = null;
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
                    payment = new Payment(Convert.ToInt32(dr["commissionPaymentState"]), Convert.ToString(dr["description"]), Convert.ToString(dr["commissionComment"]), Convert.ToString(dr["commissionEvidence"]), paymentDateString, Convert.ToInt32(dr["commission"]));
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return payment;
        }

        /// <summary>
        /// Return preferential plan info of a publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Preferential plan </returns>
        private PreferentialPlan GetPreferentialPlanInfo(int idPublication, SqlConnection con, SqlTransaction objTrans)
        {
            PreferentialPlan preferentialPlan = null;
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
                selectCommand.Transaction = objTrans;
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
                        preferentialPlan = new PreferentialPlan(Convert.ToInt32(dr["idPlan"]), Convert.ToString(dr["planDescription"]), Convert.ToInt32(dr["state"]),
                                Convert.ToString(dr["paymentDescription"]), Convert.ToInt32(dr["price"]), Convert.ToInt32(dr["planPrice"]), paymentDateString, Convert.ToString(dr["comment"]), Convert.ToString(dr["evidence"]));
                    }
                }
                else
                {
                    // It's a free plan
                    String queryPlan = cns.GetPublicationPlanById();
                    SqlCommand selectCommandPlan = new SqlCommand(queryPlan, con);
                    SqlParameter paramPlan = new SqlParameter()
                    {
                        ParameterName = "@idPlan",
                        Value = PLAN_FREE,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandPlan.Parameters.Add(paramPlan);
                    selectCommandPlan.Transaction = objTrans;
                    SqlDataReader drPlan = selectCommandPlan.ExecuteReader();
                    string plan = "";
                    while (drPlan.Read())
                    {
                        plan = Convert.ToString(drPlan["name"]);
                    }
                    drPlan.Close();
                    preferentialPlan = new PreferentialPlan(PLAN_FREE, plan, 0, null, 0, 0, null, null, null);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return preferentialPlan;
        }

        /// <summary>
        /// Given an publication id returns publication info. 
        /// Optional: add one visit to totalViews
        /// </summary>
        /// <param name="idSpace"></param>
        /// <param name="user"></param>
        /// <param name="addVisit"></param>
        /// <returns> Publication </returns>
        public Publication GetSpace(int idSpace, User user, bool addVisit)
        {
            Publication publication = null;
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
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    List<int> facilities = GetFacilitiesPublication(idPublication, con);
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
                    LocationCordinates location = new LocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<Review> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    int quantityRented = GetQuantityReserved(idPublication, con);
                    bool isMyPublication = user != null && user.IdUser == Convert.ToInt32(dr["idUser"]) ? true : false;
                    if (addVisit && !isMyPublication)
                    {
                        AddOneVisit(idPublication, con);
                    }
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    DateTime dateTo = Convert.ToDateTime(dr["expirationDate"]);
                    String dateToString = Util.ConvertDateToString(dateTo);
                    bool isRecommended = IsRecommended(Convert.ToInt32(dr["idPublication"]), con);                    
                    publication = new Publication(Convert.ToInt32(dr["idPublication"]), 0, null, null, null, null, Convert.ToInt32(dr["spaceType"]), creationDateString, dateToString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        location, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]),
                        Convert.ToString(dr["availability"]), facilities, images, null, quantityRented, reviews, ranking,
                        Convert.ToString(dr["city"]), Convert.ToInt32(dr["totalViews"]), Convert.ToBoolean(dr["individualRent"]), 0, isMyPublication, 0, null, isRecommended, 0, false);
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
            return publication;
        }

        /// <summary>
        /// Add one visit to totalViews
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
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
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
        }

        /// <summary>
        /// Update state of publication. Can also insert rejectedReason if applies
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="rejectedReason"></param>
        /// <param name="newCodeState"></param>
        /// <param name="isAdmin"></param>
        /// <returns> Publication updated </returns>
        public Publication UpdateStatePublication(int idPublication, string rejectedReason, int newCodeState, bool isAdmin)
        {
            Publication publication = null;
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
                bool publicationActiveOrRejected = IsPublicationActiveOrRejected(newCodeState, con);
                if (isAdmin && publicationActiveOrRejected)
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
                        publication = new Publication(idPublication, Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), null, null,
                            0, creationDateString, null, Convert.ToString(dr["title"]), null, null, null, 0, null, 0, 0, 0, 0, null, null, null, null, 0, null, 0, null,
                            0, false, 0, false, 0, null, false, 0, false);
                    }
                    dr.Close();
                }
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
            return publication;
        }

        /// <summary>
        /// Returns if a publication is active or rejected
        /// </summary>
        /// <param name="newCodeState"></param>
        /// <param name="con"></param>
        /// <returns> true if is active or rejected </returns>
        private bool IsPublicationActiveOrRejected(int newCodeState, SqlConnection con)
        {
            bool isPublicationActiveOrRejected = false;
            String query = cns.IsPublicationActiveOrRejected();
            SqlCommand selectCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@state",
                Value = newCodeState,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            SqlDataReader dr = selectCommand.ExecuteReader();
            while (dr.Read())
            {
                isPublicationActiveOrRejected = true;
            }
            dr.Close();
            return isPublicationActiveOrRejected;
        }

        /// <summary>
        /// Returns publication that matches certain criteria
        /// </summary>
        /// <param name="spaceType"></param>
        /// <param name="capacity"></param>
        /// <param name="facilities"></param>
        /// <param name="city"></param>
        /// <param name="pageNumber"></param>
        /// <param name="stateDescription"></param>
        /// <param name="publicationsPerPage"></param>
        /// <returns> Publications and amount of publications </returns>
        public Tuple<List<Publication>, int> GetPublicationsWithFilters(int spaceType, int capacity, List<int> facilities,
            string city, int pageNumber, string stateDescription, int publicationsPerPage)
        {
            Tuple<List<Publication>, int> result = null;
            List<Publication> publications = new List<Publication>();
            Publication publication = null;
            SqlConnection con = null;
            Util util = new Util();
            int state = 0;
            int MAX_PUBLICATIONS_PAGE = publicationsPerPage;
            string creationDateString;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (stateDescription != null)
                {
                    IDAOUtil daoUtil = new DAOUtil();
                    state = daoUtil.ConvertStatePublication(stateDescription);
                }
                int qty = 0;
                String queryQuantity = cns.GetQuantityPublicationsWithFilter(state, spaceType, capacity, facilities, city, pageNumber, publicationsPerPage);
                SqlCommand selectCommandQuantity = new SqlCommand(queryQuantity, con);
                List<SqlParameter> prmQty = new List<SqlParameter>()
                    {
                        new SqlParameter("@spaceType", SqlDbType.Int) { Value = spaceType},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = capacity},
                        new SqlParameter("@state", SqlDbType.Int) {Value = state},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = city ?? ""},
                    };
                selectCommandQuantity.Parameters.AddRange(prmQty.ToArray());
                SqlDataReader drQty = selectCommandQuantity.ExecuteReader();
                while (drQty.Read())
                {
                    qty = Convert.ToInt32(drQty["quantity"]);
                }
                drQty.Close();

                String query = cns.GetPublicationsWithFilter(facilities, spaceType, capacity, city, MAX_PUBLICATIONS_PAGE, state);
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                 {
                    new SqlParameter("@spaceType", SqlDbType.Int) { Value = spaceType},
                    new SqlParameter("@capacity", SqlDbType.Int) {Value = capacity},
                    new SqlParameter("@state", SqlDbType.Int) {Value = state},
                    new SqlParameter("@city", SqlDbType.VarChar) {Value = city ?? ""},
                };
                selectCommand.Parameters.AddRange(prm.ToArray());
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    List<int> facilitiesId = GetFacilitiesPublication(idPublication, con);
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
                    LocationCordinates location = new LocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<Review> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    int quantityRented = GetQuantityReserved(idPublication, con);
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    DateTime dateTo = Convert.ToDateTime(dr["expirationDate"]);
                    String dateToString = Util.ConvertDateToString(dateTo);
                    bool isRecommended = IsRecommended(Convert.ToInt32(dr["idPublication"]), con);
                    PreferentialPlan preferentialPlan = GetPreferentialPlanInfo(idPublication, con, null);
                    publication = new Publication(Convert.ToInt32(dr["idPublication"]), 0, Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToInt32(dr["spaceType"]), creationDateString, dateToString, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        location, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]),
                        facilitiesId, images, null, quantityRented, reviews, ranking, Convert.ToString(dr["city"]), Convert.ToInt32(dr["totalViews"]), Convert.ToBoolean(dr["individualRent"]), 0, false,
                        0, preferentialPlan, isRecommended, 0, false);
                    publications.Add(publication);
                }
                dr.Close();
                result = Tuple.Create(publications, qty);

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
            return result;

        }

        /// <summary>
        /// Returns if a publication is recommended
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> true if it is recommended</returns>
        private bool IsRecommended(int idPublication, SqlConnection con)
        {
            bool isRecommended = false;
            String query = cns.IsRecommended();
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
                isRecommended = true;
            }
            dr.Close();
            return isRecommended;
        }

        /// <summary>
        /// Returns if a publication is a favourite publication to the user  
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="idUser"></param>
        /// <returns> true if it is favourite </returns>
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

        /// <summary>
        /// Returns reviews of a publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Reviews </returns>
        public List<Review> GetReviews(int idPublication, SqlConnection con)
        {
            List<Review> reviews = new List<Review>();
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
                Review review;
                while (dr.Read())
                {
                    review = new Review(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToInt32(dr["rating"]), Convert.ToString(dr["review"]), Convert.ToInt32(dr["idReservation"]));
                    reviews.Add(review);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return reviews;
        }

        /// <summary>
        /// Returns how many times publications has been reserved
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Number of reservations</returns>
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
        
        /// <summary>
        /// Returns publications that has the same capacity, space type and city 
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="capacity"></param>
        /// <param name="spaceType"></param>
        /// <param name="city"></param>
        /// <returns> Publications </returns>
        public List<Publication> GetRelatedSpaces(int idPublication, int capacity, int spaceType, string city)
        {
            List<Publication> related = new List<Publication>();
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
                Publication publication;
                string creationDateString;
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    List<int> facilities = GetFacilitiesPublication(idPublication, con);
                    String queryImages = cns.GetImages();
                    SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                    SqlParameter parametroImages = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = Convert.ToInt32(dr["idPublication"]),
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
                    LocationCordinates location = new LocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<Review> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    DateTime creationDate = Convert.ToDateTime(dr["creationDate"]);
                    creationDateString = Util.ConvertDateToString(creationDate);
                    publication = new Publication(Convert.ToInt32(dr["idPublication"]), 0, null, null, null, null, Convert.ToInt32(dr["spaceType"]), creationDateString, null, Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        location, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]),
                        Convert.ToString(dr["availability"]), facilities, images, null, 0, reviews, ranking, Convert.ToString(dr["city"]),
                        Convert.ToInt32(dr["totalViews"]), false, 0, false, 0, null, false, 0, false);
                    related.Add(publication);
                }
                if (related.Count != 0)
                {
                    List<int> idOtherPublications = GetIdOtherPublicationConfig(idPublication);
                    if (idOtherPublications.Count != 0)
                    {
                        // Remove publications associated (child publications, parent publication)
                        related.RemoveAll(Publication => idOtherPublications.Contains(Publication.IdPublication));
                    }
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return related;
        }

        /// <summary>
        /// Add/removes favorite spaces
        /// </summary>
        /// <param name="code"></param>
        /// <param name="idPublication"></param>
        /// <param name="idUser"></param>
        public void UpdateFavorite(int code, int idPublication, long idUser)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                string query = "";
                if (code == 1)
                {
                    //Insert
                    query = cns.AddFavorite();
                }
                else
                {
                    query = cns.DeleteFavorite();
                }
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
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

        /// <summary>
        /// Updates publication data
        /// </summary>
        /// <param name="publication"></param>
        /// <param name="images"></param>
        /// <param name="imagesURL"></param>
        /// <param name="user"></param>
        /// <returns> Date to, availabilty, preferential plan and new price </returns>
        public async Task<Dictionary<string, string>> UpdatePublication(Publication publication, List<Image> images, List<string> imagesURL, User user)
        {
            Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            int idPublication = publication.IdPublication;
            StorageUtil storageUtil = new StorageUtil();
            string currentImagesURL = "";
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                string queryImages = "";
                //Step 1: delete images
                if (imagesURL == null)
                {
                    // If there is no URL, it means that all images were deleted
                    queryImages = cns.DeleteAllImages();
                }
                else
                {
                    currentImagesURL = StorageUtil.CreateImagesURLString(imagesURL);
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
                if (images != null && images.Count != 0)
                {
                    List<string> urls = await storageUtil.StoreImageAsync(images, user.IdUser, idPublication);
                    InsertImages(con, objTrans, idPublication, urls);
                }
                //Step 3: delete facilities
                DeleteFacilities(idPublication, con, objTrans);
                //Step 4: insert facilities
                foreach (var facility in publication.Facilities)
                {
                    InsertFacility(idPublication, facility, con, objTrans);
                }
                //Step 6: update preferential plan
                PreferentialPlan currentPreferentialPlan = GetPreferentialPlanInfo(idPublication, con, objTrans);
                int currentPreferentialPlanId = currentPreferentialPlan.IdPlan;
                if (currentPreferentialPlanId != publication.IdPlan)
                {
                    bool paid = currentPreferentialPlan.StateCode == PAYMENT_PAID_STATE;
                    int newPlanPrice = GetPriceByPlanId(publication.IdPlan, con, objTrans);
                    bool upgradingPlan = currentPreferentialPlan.Price < newPlanPrice;
                    if (paid && upgradingPlan)
                    {
                        //Step 6.1: recalculate price
                        int daysLeft = GetDaysLeftPublication(idPublication, con, objTrans);
                        List<PublicationPlan> publicationPlans = GetPublicationPlans();
                        PreferentialPlan prefPlan = GetPreferentialPlanInfo(idPublication, con, objTrans);
                        bool oldPricePaid = prefPlan.StateCode == PAYMENT_PAID_STATE ? true : false;
                        int newPrice = Util.RecalculatePrice(newPlanPrice, daysLeft, currentPreferentialPlanId, publicationPlans);
                        //Step 6.2: update preferential plan and payment
                        UpdatePreferentialPlanUpgraded(idPublication, publication.IdPlan, newPrice, con, objTrans);
                    }
                    else
                    {
                        if (!paid)
                        {
                            bool isFreeCurrentPlan = IsFreePreferentialPlan(currentPreferentialPlanId, con, objTrans);
                            if (isFreeCurrentPlan)
                            {
                                //If current plan is free, create a preferential plan
                                CreatePreferentialPayment(idPublication, 0, publication.IdPlan, con, objTrans);
                            }
                            else
                            {
                                //If current plan it is not free
                                bool isFreeNewPlan = IsFreePreferentialPlan(publication.IdPlan, con, objTrans);
                                if (!upgradingPlan)
                                {
                                    if (isFreeNewPlan)
                                    {
                                        //Delete preferential plan and update publication price = 0
                                        DeletePreferentialPlan(idPublication, con, objTrans);
                                        SetPreferentialPlanPrice(idPublication, publication.IdPlan, 0, con, objTrans);
                                    }
                                    else
                                    {
                                        //Update preferential plan and update publication price
                                        UpdatePreferentialPlanUpgraded(idPublication, publication.IdPlan, newPlanPrice, con, objTrans);
                                    }
                                }
                                else
                                {
                                    //Update preferential plan and update publication price
                                    UpdatePreferentialPlanUpgraded(idPublication, publication.IdPlan, newPlanPrice, con, objTrans);
                                }
                            }
                        }
                    }

                }
                //Step 7: update publication
                string query = cns.UpdatePublication();
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@spaceType", SqlDbType.Int) {Value = publication.SpaceType},
                        new SqlParameter("@title", SqlDbType.VarChar) {Value = publication.Title},
                        new SqlParameter("@description", SqlDbType.VarChar) {Value = publication.Description},
                        new SqlParameter("@address", SqlDbType.VarChar) {Value = publication.Address},
                        new SqlParameter("@locationLat", SqlDbType.Decimal) {Value = publication.Location.Latitude},
                        new SqlParameter("@locationLong", SqlDbType.Decimal) {Value = publication.Location.Longitude},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = publication.Capacity},
                        new SqlParameter("@videoURL", SqlDbType.VarChar) {Value = publication.VideoURL},
                        new SqlParameter("@hourPrice", SqlDbType.Int) {Value = publication.HourPrice},
                        new SqlParameter("@dailyPrice", SqlDbType.Int) {Value = publication.DailyPrice},
                        new SqlParameter("@weeklyPrice", SqlDbType.Int) {Value = publication.WeeklyPrice},
                        new SqlParameter("@monthlyPrice", SqlDbType.Int) {Value = publication.MonthlyPrice},
                        new SqlParameter("@availability", SqlDbType.VarChar) {Value = publication.Availability},
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = publication.City}
                    };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                objTrans.Commit();
                keyValuePairs = GetPublicationInfoAfterUpdate(idPublication, con);
                return keyValuePairs;
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
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

        /// <summary>
        /// Returns date to, availabilty, preferential plan and new price to send email with new info
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Date to, availabilty, preferential plan and new price </returns>
        private Dictionary<string, string> GetPublicationInfoAfterUpdate(int idPublication, SqlConnection con)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            string query = cns.GetPublicationInfoAfterUpdate();
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
                String dateTo = Util.ConvertDateToString(Convert.ToDateTime(dr["expirationDate"]));
                result[ParamCodes.DATE_TO] = dateTo;
                result[ParamCodes.AVAILABILITY] = Convert.ToString(dr["availability"]);
                PreferentialPlan preferentialPlan = GetPreferentialPlanInfo(idPublication, con, null);
                result[ParamCodes.PREFERENTIAL_PLAN] = preferentialPlan.Description;
                result[ParamCodes.PRICE] = Convert.ToInt32(dr["planPrice"]).ToString();
            }
            dr.Close();
            return result;
        }

        /// <summary>
        /// Deletes preferential plan of an publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        private void DeletePreferentialPlan(int idPublication, SqlConnection con, SqlTransaction objTrans)
        {
            string query = cns.DeletePreferentialPlan();
            SqlCommand deleteCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idPublication",
                Value = idPublication,
                SqlDbType = SqlDbType.Int
            };
            deleteCommand.Parameters.Add(param);
            deleteCommand.Transaction = objTrans;
            deleteCommand.ExecuteNonQuery();
        }

        /// <summary>
        /// Returns price of an preferential plan
        /// </summary>
        /// <param name="idPlan"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Price </returns>
        private int GetPriceByPlanId(int idPlan, SqlConnection con, SqlTransaction objTrans)
        {
            string query = cns.GetPriceByPlanId();
            SqlCommand selectCommand = new SqlCommand(query, con);
            int price = 0;
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
                price = Convert.ToInt32(dr["price"]);
            }
            dr.Close();
            return price;
        }

        /// <summary>
        /// Upgrades preferential plan
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="idPlan"></param>
        /// <param name="newPrice"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        private void UpdatePreferentialPlanUpgraded(int idPublication, int idPlan, int newPrice, SqlConnection con, SqlTransaction objTrans)
        {
            string queryPreferential = cns.UpdatePreferentialPlanUpgraded();
            SqlCommand updatePreferential = new SqlCommand(queryPreferential, con);
            List<SqlParameter> param = new List<SqlParameter>()
            {
                new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPlan},
            };
            updatePreferential.Parameters.AddRange(param.ToArray());
            updatePreferential.Transaction = objTrans;
            updatePreferential.ExecuteNonQuery();
            SetPreferentialPlanPrice(idPublication, idPlan, newPrice, con, objTrans);
        }

        /// <summary>
        /// Updates preferential plan price into publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="idPlan"></param>
        /// <param name="price"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        private void SetPreferentialPlanPrice(int idPublication, int idPlan, int price, SqlConnection con, SqlTransaction objTrans)
        {
            string queryPreferential = cns.SetPreferentialPlanPrice();
            SqlCommand updatePreferential = new SqlCommand(queryPreferential, con);
            List<SqlParameter> param = new List<SqlParameter>()
            {
                new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                new SqlParameter("@price", SqlDbType.Int) {Value = price},
                new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPlan},
            };
            updatePreferential.Parameters.AddRange(param.ToArray());
            updatePreferential.Transaction = objTrans;
            updatePreferential.ExecuteNonQuery();
        }

        /// <summary>
        /// Returns how many days publication has left before finish
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Days left </returns>
        private int GetDaysLeftPublication(int idPublication, SqlConnection con, SqlTransaction objTrans)
        {
            string query = cns.GetDaysLeftPublication();
            SqlCommand selectCommand = new SqlCommand(query, con);
            int daysLeft = 0;
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
                daysLeft = Convert.ToInt32(dr["daysLeft"]);
            }
            dr.Close();
            return daysLeft;
        }

        /// <summary>
        /// Deletes all facilities of a publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        private void DeleteFacilities(int idPublication, SqlConnection con, SqlTransaction objTrans)
        {
            string query = cns.DeleteFacilities();
            SqlCommand deleteCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idPublication",
                Value = idPublication,
                SqlDbType = SqlDbType.Int
            };
            deleteCommand.Parameters.Add(param);
            deleteCommand.Transaction = objTrans;
            deleteCommand.ExecuteNonQuery();
        }

        /// <summary>
        /// Creates a new reservation
        /// </summary>
        /// <param name="reservation"></param>
        /// <param name="user"></param>
        /// <param name="idPlan"></param>
        public void CreateReservation(Reservation reservation, User user, int idPlan)
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
                int reservationCommission = Util.CalculateReservationCommission(reservation.TotalPrice);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = reservation.IdPublication},
                        new SqlParameter("@idCustomer", SqlDbType.Int) {Value = user.IdUser},
                        new SqlParameter("@planSelected", SqlDbType.Int) {Value = idPlan},
                        new SqlParameter("@dateFrom", SqlDbType.DateTime) {Value = reservation.DateFrom},
                        new SqlParameter("@hourFrom", SqlDbType.VarChar) {Value =  reservation.HourFrom != null ? reservation.HourFrom : ""},
                        new SqlParameter("@hourTo", SqlDbType.VarChar) {Value = reservation.HourTo != null ? reservation.HourTo : ""},
                        new SqlParameter("@people", SqlDbType.Int) {Value =reservation.People},
                        new SqlParameter("@comment", SqlDbType.VarChar) {Value = reservation.Comment},
                        new SqlParameter("@totalPrice", SqlDbType.Int) {Value = reservation.TotalPrice},
                        new SqlParameter("@commission", SqlDbType.Int) {Value = reservationCommission},
                        new SqlParameter("@reservedQty", SqlDbType.Int) {Value = reservation.ReservedQuantity}

                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.Transaction = objTrans;
                insertCommand.ExecuteNonQuery();
                objTrans.Commit();
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
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

        /// <summary>
        /// Returns reservation plan id given a reservation plan description
        /// </summary>
        /// <param name="desc"></param>
        /// <returns> Reservation plan id </returns>
        public int GetReservationPlanByDescription(string desc)
        {
            SqlConnection con = null;
            int reservationPlan = 0;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetReservationPlanByDescription();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@description",
                    Value = desc,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    reservationPlan = Convert.ToInt32(dr["idReservationPlan"]);
                }
                dr.Close();
                return reservationPlan;
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

        /// <summary>
        /// Returns publisher of publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <returns> Publisher </returns>
        public User GetPublisherByPublication(int idPublication)
        {
            SqlConnection con = null;
            try
            {
                String query = cns.GetPublisherByPublication();
                con = new SqlConnection(GetConnectionString());
                con.Open();
                SqlCommand selectCommand = new SqlCommand(query, con);
                User user = null;
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
                    user = new User(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), null, Convert.ToString(dr["name"]), 
                        Convert.ToString(dr["lastName"]), null,Convert.ToBoolean(dr["active"]), null, Convert.ToInt32(dr["language"]));
                }
                dr.Close();
                return user;
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

        /// <summary>
        /// Returns reservations of a customer (6 months old)
        /// </summary>
        /// <param name="mail"></param>
        /// <param name="idCustomer"></param>
        /// <returns> Reservations </returns>
        public List<ReservationExtended> GetReservationsCustomer(string mail, long idCustomer)
        {
            List<ReservationExtended> reservations = new List<ReservationExtended>();
            ReservationExtended reservation = null;
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
                    Payment payment = GetReservationPaymentInfo(idReservation, con);
                    String dateConvertedFrom = Util.ConvertDateToString(Convert.ToDateTime(dr["dateFrom"]));
                    DateTime dateTo = Convert.ToDateTime(dr["dateTo"] is DBNull ? null : dr["dateTo"]);
                    String dateConvertedTo = "";
                    if (DEFAULT_DATE_TIME != dateTo)
                    {
                        dateConvertedTo = Util.ConvertDateToString(Convert.ToDateTime(dr["dateTo"]));
                    }
                    reservation = new ReservationExtended(idReservation, Convert.ToString(dr["title"]), Convert.ToInt32(dr["idPublication"]),
                        mail, Convert.ToString(dr["planSelected"]),
                        Convert.ToInt32(dr["reservedQty"] is DBNull ? 0 : dr["reservedQty"]), Convert.ToDateTime(dr["dateFrom"]), dateConvertedFrom, dateTo, dateConvertedTo, Convert.ToString(dr["hourFrom"]),
                        Convert.ToString(dr["hourTo"]), Convert.ToInt32(dr["people"] is DBNull ? 0 : dr["people"]), Convert.ToString(dr["comment"]),
                        Convert.ToInt32(dr["totalPrice"]), Convert.ToInt32(dr["state"]), Convert.ToString(dr["description"]), Convert.ToBoolean(dr["individualRent"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), wasReviewed, payment, null, null, null);
                    reservations.Add(reservation);
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
            return reservations;

        }

        /// <summary>
        /// Returns reservation payment info
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="con"></param>
        /// <returns> Payment info </returns>
        private Payment GetReservationPaymentInfo(int idReservation, SqlConnection con)
        {
            string query = cns.GetReservationPaymentInfo();
            SqlCommand selectCommand = new SqlCommand(query, con);
            Payment payment = null;
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
                payment = new Payment(Convert.ToInt32(dr["paymentCustomerState"]), Convert.ToString(dr["description"]), Convert.ToString(dr["paymentCustomerComment"]), Convert.ToString(dr["paymentCustomerEvidence"]), paymentDateString, 0);
            }
            dr.Close();

            return payment;
        }

        /// <summary>
        /// Given a publisher id, returns publisher spaces reserved
        /// </summary>
        /// <param name="idUser"></param>
        /// <returns> Reservations </returns>
        public List<ReservationExtended> GetReservationsPublisher(long idUser)
        {
            List<ReservationExtended> reservations = new List<ReservationExtended>();
            ReservationExtended reservation;
            SqlConnection con = null;
            int idReservation;
            bool wasReviewed;
            Payment payment;
            Payment paymentCommission;
            String dateConvertedFrom;
            String dateConvertedTo;
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
                    dateConvertedFrom = Util.ConvertDateToString(Convert.ToDateTime(dr["dateFrom"]));
                    DateTime dateTo = Convert.ToDateTime(dr["dateTo"] is DBNull ? null : dr["dateTo"]);
                    dateConvertedTo = "";
                    if (DEFAULT_DATE_TIME != dateTo)
                    {
                        dateConvertedTo = Util.ConvertDateToString(Convert.ToDateTime(dr["dateTo"]));
                    }
                    paymentCommission = GetCommissionPayment(idReservation, con);
                    reservation = new ReservationExtended(Convert.ToInt32(dr["idReservation"]), Convert.ToString(dr["title"]), Convert.ToInt32(dr["idPublication"]),
                        Convert.ToString(dr["mail"]), Convert.ToString(dr["planSelected"]),
                        Convert.ToInt32(dr["reservedQty"] is DBNull ? 0 : dr["reservedQty"]), Convert.ToDateTime(dr["dateFrom"]), dateConvertedFrom, dateTo, dateConvertedTo, Convert.ToString(dr["hourFrom"]),
                        Convert.ToString(dr["hourTo"]), Convert.ToInt32(dr["people"] is DBNull ? 0 : dr["people"]), Convert.ToString(dr["comment"]),
                        Convert.ToInt32(dr["totalPrice"]), Convert.ToInt32(dr["state"]), Convert.ToString(dr["description"]), Convert.ToBoolean(dr["individualRent"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), wasReviewed, payment, paymentCommission, Convert.ToString(dr["name"]), null);
                    reservations.Add(reservation);
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
            return reservations;

        }

        /// <summary>
        /// Updates state of a reservation
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="canceledReason"></param>
        /// <param name="newCodeState"></param>
        /// <param name="newDescriptionState"></param>
        /// <param name="dateTo"></param>
        /// <returns> Customer and publisher info </returns>
        public UsersReservationBasicData UpdateStateReservation(int idReservation, string canceledReason, int newCodeState, string newDescriptionState, DateTime dateTo)
        {
            SqlConnection con = null;
            UsersReservationBasicData result;
            string canceledReasonAux = "";
            if (canceledReason != null)
            {
                canceledReasonAux = canceledReason;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.UdpdateStateReservation(canceledReason);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                        new SqlParameter("@state", SqlDbType.Int) {Value = newCodeState},
                        new SqlParameter("@canceledReason", SqlDbType.VarChar) {Value = canceledReasonAux},
                        new SqlParameter("@dateTo", SqlDbType.DateTime) {Value = dateTo},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
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
                    updatePayment.ExecuteNonQuery();
                }
                result = GetUsersReservationBasicData(idReservation);
                return result;
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

        /// <summary>
        /// Returns both customer and publisher info of a reservation
        /// </summary>
        /// <param name="idReservation"></param>
        /// <returns> Customer and publisher info </returns>
        public UsersReservationBasicData GetUsersReservationBasicData(int idReservation)
        {
            SqlConnection con = null;
            UsersReservationBasicData result = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                string queryUsers = cns.GetUsersByReservation();
                SqlCommand selectCommandUsers = new SqlCommand(queryUsers, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idReservation",
                    Value = idReservation,
                    SqlDbType = SqlDbType.Int
                };
                selectCommandUsers.Parameters.Add(param);
                SqlDataReader dr = selectCommandUsers.ExecuteReader();
                while (dr.Read())
                {
                    result = new UsersReservationBasicData(Convert.ToString(dr["cMail"]), Convert.ToString(dr["cName"]), Convert.ToInt32(dr["cLanguage"]),
                       Convert.ToString(dr["pMail"]), Convert.ToString(dr["pName"]), Convert.ToInt32(dr["pLanguage"]), Convert.ToInt32(dr["planSelected"]));
                }
                dr.Close();
                return result;
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

        /// <summary>
        /// Updates reservation info
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="dateFrom"></param>
        /// <param name="hourFrom"></param>
        /// <param name="hourTo"></param>
        /// <param name="totalPrice"></param>
        /// <param name="people"></param>
        /// <param name="reservedQuantity"></param>
        /// <returns> Customer and publisher info </returns>
        public UsersReservationBasicData UpdateReservation(int idReservation, DateTime dateFrom, string hourFrom,
                        string hourTo, int totalPrice, int people, int reservedQuantity)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            UsersReservationBasicData result = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                string query = cns.UpdateReservation();
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                    new SqlParameter("@dateFrom", SqlDbType.DateTime) {Value = dateFrom},
                    new SqlParameter("@hourFrom", SqlDbType.VarChar) {Value = hourFrom != null ? hourFrom : ""},
                    new SqlParameter("@hourTo", SqlDbType.VarChar) {Value = hourTo != null ? hourTo : ""},
                    new SqlParameter("@totalPrice", SqlDbType.Int) {Value = totalPrice},
                    new SqlParameter("@people", SqlDbType.Int) {Value = people},
                    new SqlParameter("@reservedQty", SqlDbType.Int) {Value = reservedQuantity},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                objTrans.Commit();
                result = GetUsersReservationBasicData(idReservation);
                return result;
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
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

        /// <summary>
        /// Creates a review of a publication
        /// </summary>
        /// <param name="review"></param>
        /// <param name="idUser"></param>
        public void CreateReview(Review review, long idUser)
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
                        new SqlParameter("@idReservation", SqlDbType.Int) {Value = review.IdReservation},
                        new SqlParameter("@idUser", SqlDbType.Int) {Value = idUser},
                        new SqlParameter("@rating", SqlDbType.VarChar) {Value = review.Rating},
                        new SqlParameter("@review", SqlDbType.VarChar) {Value = review.ReviewDescription},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
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

        /// <summary>
        /// Creates a new publication's question
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="question"></param>
        /// <param name="idUser"></param>
        public void CreatePublicationQuestion(int idPublication, string question, long idUser)
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
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@idUser", SqlDbType.Int) {Value = idUser},
                        new SqlParameter("@question", SqlDbType.VarChar) {Value = question},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
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

        /// <summary>
        /// Creates a new question's answer
        /// </summary>
        /// <param name="idQuestion"></param>
        /// <param name="answer"></param>
        /// <returns> Question's user info </returns>
        public User CreatePublicationAnswer(int idQuestion, string answer)
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
                        new SqlParameter("@idQuestion", SqlDbType.Int) {Value = idQuestion},
                        new SqlParameter("@answer", SqlDbType.VarChar) {Value = answer},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
                User user = GetUserByQuestion(idQuestion, con);
                return user;
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

        /// <summary>
        /// Returns user info given a question id
        /// </summary>
        /// <param name="idQuestion"></param>
        /// <param name="con"></param>
        /// <returns> User </returns>
        private User GetUserByQuestion(int idQuestion, SqlConnection con)
        {
            User user = null;
            String query = cns.GetUserByQuestion();
            SqlCommand selectCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idQuestion",
                Value = idQuestion,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            SqlDataReader dr = selectCommand.ExecuteReader();
            while (dr.Read())
            {
                user = new User(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), null, Convert.ToString(dr["name"]), 
                    Convert.ToString(dr["lastName"]), null, Convert.ToBoolean(dr["active"]), "", Convert.ToInt32(dr["language"]));
            }
            return user;
        }

        /// <summary>
        /// Returns all questions of a publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <returns> Publication's questions</returns>
        public List<PublicationQuestion> GetPublicationQuestions(int idPublication)
        {
            List<PublicationQuestion> questions = new List<PublicationQuestion>();
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
                PublicationQuestion question;
                while (dr.Read())
                {
                    Answer answer = null; ;
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
                        answer = new Answer(Convert.ToString(drAnswer["answer"]), creationDateAnswer);
                    }
                    drAnswer.Close();
                    string creationDate = Util.ConvertDateToString(Convert.ToDateTime(dr["creationDate"]));
                    question = new PublicationQuestion(Convert.ToInt32(dr["idQuestion"]), Convert.ToString(dr["name"]), Convert.ToString(dr["question"]), creationDate, answer);
                    questions.Add(question);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return questions;
        }

        /// <summary>
        /// Returns if a reservations was reviewed already
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="con"></param>
        /// <returns> true if reservation was reviewed </returns>
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
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return wasReviewed;
        }

        /// <summary>
        /// Returns all questions that has not been answered yet
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Questions unanswered </returns>
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
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return qty;
        }

        /// <summary>
        /// Returns all publications plans
        /// </summary>
        /// <returns> Publications plans </returns>
        public List<PublicationPlan> GetPublicationPlans()
        {
            SqlConnection con = null;
            List<PublicationPlan> plans = new List<PublicationPlan>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationPlans();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                PublicationPlan plan;
                while (dr.Read())
                {
                    plan = new PublicationPlan(Convert.ToInt32(dr["idPlan"]), Convert.ToString(dr["name"]), Convert.ToInt32(dr["price"]), Convert.ToInt32(dr["days"]));
                    plans.Add(plan);
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

        /// <summary>
        /// Updates preferential plan payment
        /// </summary>
        /// <param name="idPublicaton"></param>
        /// <param name="comment"></param>
        /// <param name="evidence"></param>
        public async Task UpdatePreferentialPayment(int idPublicaton, string comment, Image evidence)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            StorageUtil storageUtil = new StorageUtil();
            string url = "";
            string commentAux = "";
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                int idPayment = GetIdPreferentialPayment(idPublicaton, con, objTrans);
                if (evidence != null && evidence.Base64String != null)
                {
                    // Insert evidence
                    url = await storageUtil.StoreEvidencePaymentPlanAsync(evidence, idPayment, idPublicaton);
                }
                if (comment != null)
                {
                    commentAux = comment;
                }
                string query = cns.UpdatePreferentialPayment(comment, url);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                new SqlParameter("@idPrefPayments", SqlDbType.Int) {Value = idPayment},
                new SqlParameter("@comment", SqlDbType.VarChar) {Value = commentAux},
                new SqlParameter("@evidence", SqlDbType.VarChar) {Value = url},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                objTrans.Commit();
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
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

        /// <summary>
        /// Returns id of preferential payment given a publication id
        /// </summary>
        /// <param name="idPreferentialPayment"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Preferential payment id </returns>
        private int GetIdPreferentialPayment(int idPublication, SqlConnection con, SqlTransaction objTrans)
        {
            int id = 0;
            try
            {
                String query = cns.GetIdPreferentialPayment();
                SqlCommand selectCommand = new SqlCommand(query, con);
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
                    id = Convert.ToInt32(dr["idPrefPayments"]);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return id;
        }

        /// <summary>
        /// Returns id plan given a publication id payment
        /// </summary>
        /// <param name="idPayment"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Preferential plan id </returns>
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
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return id;
        }

        /// <summary>
        /// Updates reservation payment values
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="comment"></param>
        /// <param name="evidence"></param>
        /// <param name="idUser"></param>
        /// <returns> Publisher info </returns>
        public async Task<UserBasicData> PayReservationCustomer(int idReservation, string comment, Image evidence, long idUser)
        {
            SqlConnection con = null;
            StorageUtil storageUtil = new StorageUtil();
            string url = "";
            string commentAux = "";
            if (comment != null)
            {
                commentAux = comment;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (evidence != null && evidence.Base64String != null)
                {
                    // Insert evidence
                    url = await storageUtil.StoreEvidencePaymentReservationCustomerAsync(evidence, idUser, idReservation);
                }
                string query = cns.PayReservationCustomer(comment, url);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                    new SqlParameter("@comment", SqlDbType.VarChar) {Value = commentAux},
                    new SqlParameter("@evidence", SqlDbType.VarChar) {Value = url},
                    };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
                UserBasicData user = GetPublisherFromReservation(idReservation, con);
                return user;
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

        /// <summary>
        /// Returns publisher info given a reservation id
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="con"></param>
        /// <returns> Publisher info </returns>
        private UserBasicData GetPublisherFromReservation(int idReservation, SqlConnection con)
        {
            UserBasicData user = null;
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
                    user = new UserBasicData(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToInt32(dr["language"]));
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return user;
        }

        /// <summary>
        /// Updates commission payment values
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="comment"></param>
        /// <param name="evidence"></param>
        /// <param name="idUser"></param>
        public async Task PayReservationPublisher(int idReservation, string comment, Image evidence, long idUser)
        {
            SqlConnection con = null;
            StorageUtil storageUtil = new StorageUtil();
            string url = "";
            string commentAux = "";
            if (comment != null)
            {
                commentAux = comment;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (evidence != null && evidence.Base64String != null)
                {
                    // Insert evidence
                    url = await storageUtil.StoreEvidencePaymentReservationPublisherAsync(evidence, idUser, idReservation);
                }
                string query = cns.PayReservationPublisher(comment, url);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                    new SqlParameter("@comment", SqlDbType.VarChar) {Value = commentAux},
                    new SqlParameter("@evidence", SqlDbType.VarChar) {Value = url},
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

        /// <summary>
        /// Approves/reject customer reservation payment
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="approved"></param>
        /// <param name="rejectedReason"></param>
        /// <returns> Customer info </returns>
        public UserBasicData UpdatePaymentCustomer(int idReservation, bool approved, string rejectedReason)
        {
            SqlConnection con = null;
            UserBasicData user;
            try
            {
                string rejectedReasonAux = "";
                if (rejectedReason != null)
                {
                    rejectedReasonAux = rejectedReason;
                }
                con = new SqlConnection(GetConnectionString());
                con.Open();
                string query = cns.UpdatePaymentCustomer(rejectedReason);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                new SqlParameter("@paymentCustomerState", SqlDbType.Int) {Value = approved ? PAYMENT_PAID_STATE : PAYMENT_REJECTED_STATE},
                new SqlParameter("@paymentCustomerRejectedReason", SqlDbType.VarChar) {Value = rejectedReasonAux},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
                user = GetCustomerFromReservation(idReservation, con);
                return user;


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

        /// <summary>
        /// Given a reservation id returns customer info
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="con"></param>
        /// <returns> Customer info </returns>
        private UserBasicData GetCustomerFromReservation(int idReservation, SqlConnection con)
        {
            UserBasicData user = null;
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
                    user = new UserBasicData(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToInt32(dr["language"]));
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return user;
        }

        /// <summary>
        /// Given a publication id returns publisher info
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Publisher info </returns>
        private UserBasicData GetPublisherFromPublication(int idPublication, SqlConnection con)
        {
            UserBasicData user = null;
            try
            {
                String query = cns.GetPublisherFromPublication();
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
                    user = new UserBasicData(Convert.ToString(dr["mail"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToInt32(dr["language"]));
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return user;
        }

        /// <summary>
        /// Returns all publication plan payments of all publications
        /// </summary>
        /// <returns> Publication plans</returns>
        public List<PublicationPaymentAdmin> GetPublicationPlanPayments()
        {
            SqlConnection con = null;
            List<PublicationPaymentAdmin> payments = new List<PublicationPaymentAdmin>();
            string paymentDateString = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationPlanPayments();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                PublicationPaymentAdmin payment;
                while (dr.Read())
                {
                    paymentDateString = null;
                    if (dr["paymentDate"] != DBNull.Value)
                    {
                        paymentDateString = Util.ConvertDateToString(Convert.ToDateTime(dr["paymentDate"]));
                    }
                    int idParentPublication = GetIdParentPublicationConfig(Convert.ToInt32(dr["idPublication"]), con);
                    payment = new PublicationPaymentAdmin(Convert.ToInt32(dr["idPublication"]), Convert.ToString(dr["title"]), Convert.ToString(dr["mail"]),
                         Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["planName"]),
                         Convert.ToString(dr["description"]), Convert.ToInt32(dr["planPrice"]), Convert.ToString(dr["comment"]),
                         Convert.ToString(dr["evidence"]), paymentDateString, idParentPublication);
                    payments.Add(payment);
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
            return payments;
        }

        /// <summary>
        /// Returns all commission payments of all publications
        /// </summary>
        /// <returns> Commissions payments </returns>
        public List<CommissionPaymentAdmin> GetCommissionPaymentsAdmin()
        {
            SqlConnection con = null;
            List<CommissionPaymentAdmin> commissions = new List<CommissionPaymentAdmin>();
            string paymentDateString = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetCommissionPaymentsAdmin();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                CommissionPaymentAdmin commission;
                while (dr.Read())
                {
                    paymentDateString = null;
                    if (dr["paymentCommissionDate"] != DBNull.Value)
                    {
                        paymentDateString = Util.ConvertDateToString(Convert.ToDateTime(dr["paymentCommissionDate"]));
                    }
                    commission = new CommissionPaymentAdmin(Convert.ToInt32(dr["idReservation"]), Convert.ToString(dr["title"]), Convert.ToString(dr["mail"]),
                         Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToInt32(dr["commission"]),
                         Convert.ToString(dr["description"]), Convert.ToString(dr["commissionComment"]),
                         Convert.ToString(dr["commissionEvidence"]), paymentDateString);
                    commissions.Add(commission);
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
            return commissions;
        }

        /// <summary>
        /// Returns favourites of customer
        /// </summary>
        /// <param name="idUser"></param>
        /// <returns> Favourites publications </returns>
        public List<Publication> GetFavorites(long idUser)
        {
            SqlConnection con = null;
            List<Publication> favorites = new List<Publication>();
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
                Publication publication;
                while (dr.Read())
                {
                    int idPublication = Convert.ToInt32(dr["idPublication"]);
                    List<Review> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    publication = new Publication(idPublication, 0, null, null, null, null, Convert.ToInt32(dr["spaceType"]), null, null, Convert.ToString(dr["title"]), null,
                        Convert.ToString(dr["address"]), null, Convert.ToInt32(dr["capacity"]), null, Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), null, null, null, null, 0, null,
                        ranking, Convert.ToString(dr["city"]), 0, false, 0, false, 0, null, false, 0, false);
                    favorites.Add(publication);
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
            return favorites;
        }

        /// <summary>
        /// Returns all recommended publications divided by space type
        /// </summary>
        /// <returns> Space type recommended publications </returns>
        public List<SpaceTypeRecommended> GetRecommendedPublications()
        {
            SqlConnection con = null;
            List<SpaceTypeRecommended> recommendedList = new List<SpaceTypeRecommended>();
            SpaceTypeRecommended recommended;
            List<Recommended> offices;
            List<Recommended> coworking;
            List<Recommended> meetingRooms;
            List<Recommended> events;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationsRecommended();
                offices = GetRecommendedSpaceType(query, con, PUBLICATION_OFFICE);
                recommended = new SpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_OFFICE,
                    Publications = offices
                };
                recommendedList.Add(recommended);
                coworking = GetRecommendedSpaceType(query, con, PUBLICATION_COWORKING);
                recommended = new SpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_COWORKING,
                    Publications = coworking
                };
                recommendedList.Add(recommended);
                meetingRooms = GetRecommendedSpaceType(query, con, PUBLICATION_MEETING_ROOM);
                recommended = new SpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_MEETING_ROOM,
                    Publications = meetingRooms
                };
                recommendedList.Add(recommended);
                events = GetRecommendedSpaceType(query, con, PUBLICATION_EVENTS);
                recommended = new SpaceTypeRecommended
                {
                    SpaceType = PUBLICATION_EVENTS,
                    Publications = events
                };
                recommendedList.Add(recommended);
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
            return recommendedList;
        }

        /// <summary>
        /// GIven a space type, returns recommended publications
        /// </summary>
        /// <param name="query"></param>
        /// <param name="con"></param>
        /// <param name="spaceType"></param>
        /// <returns> Recommended publications </returns>
        private List<Recommended> GetRecommendedSpaceType(string query, SqlConnection con, int spaceType)
        {
            List<Recommended> spaceTypeList = new List<Recommended>(MAX_TOTAL);
            List<Recommended> spaceTypeListAux = new List<Recommended>();
            Recommended publication;
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
                    publication = BuildRecommended(dr, con);
                    spaceTypeListAux.Add(publication);
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
                }
                else
                {
                    addedSilver = MAX_GOLD;
                }
                //SILVER
                SqlCommand selectCommandSilver = new SqlCommand(query, con);
                List<SqlParameter> prmSilver = new List<SqlParameter>()
                {
                new SqlParameter("@spaceType", SqlDbType.Int) {Value = spaceType},
                new SqlParameter("@idPlan", SqlDbType.VarChar) {Value = PLAN_SILVER},
                };
                selectCommandSilver.Parameters.AddRange(prmSilver.ToArray());
                dr = selectCommandSilver.ExecuteReader();
                while (dr.Read())
                {
                    publication = BuildRecommended(dr, con);
                    spaceTypeListAux.Add(publication);
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
                        publication = BuildRecommended(dr, con);
                        spaceTypeListAux.Add(publication);
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
                        publication = BuildRecommended(dr, con);
                        spaceTypeListAux.Add(publication);
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
            }
            catch (Exception)
            {
                if (con != null)
                {
                    con.Close();
                }
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            return spaceTypeList;
        }

        /// <summary>
        /// Creates recommended publication
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="con"></param>
        /// <returns> Recommended publication </returns>
        private Recommended BuildRecommended(SqlDataReader dr, SqlConnection con)
        {
            Recommended publication;
            List<string> images;
            int idPublication = Convert.ToInt32(dr["idPublication"]);
            images = GetImages(idPublication, con);
            publication = new Recommended(idPublication, Convert.ToString(dr["title"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                Convert.ToInt32(dr["capacity"]), images);
            return publication;
        }

        /// <summary>
        /// Returns all images of a publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Images </returns>
        private List<String> GetImages(int idPublication, SqlConnection con)
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

        /// <summary>
        /// Approves/reject preferential plan payment
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="approved"></param>
        /// <param name="rejectedReason"></param>
        /// <returns> Publisher info </returns>
        public UserBasicData UpdatePreferentialPaymentAdmin(int idPublication, bool approved, string rejectedReason)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            string rejectedReasonAux = "";
            if (rejectedReason != null)
            {
                rejectedReasonAux = rejectedReason;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                int idPayment = GetIdPreferentialPayment(idPublication, con, objTrans);
                int idPreferentialPlan = GetIdPreferentialPlan(idPayment, con, objTrans);
                string query = cns.UpdatePreferentialPaymentAdmin(rejectedReason);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                    new SqlParameter("@state", SqlDbType.Int) {Value =  approved ? PAYMENT_PAID_STATE : PAYMENT_REJECTED_STATE},
                    new SqlParameter("@idPrefPayments", SqlDbType.Int) {Value = idPayment},
                    new SqlParameter("@paymentRejectedReason", SqlDbType.VarChar) {Value = rejectedReasonAux},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                if (approved)
                {
                    string queryPubl = cns.UpdatePublicationDueToPayment();
                    SqlCommand updateCommandPubl = new SqlCommand(queryPubl, con);
                    DateTime expirationDatePublication = CalculateExpirationDatePublication(idPreferentialPlan, con, objTrans);
                    List<SqlParameter> prmPubl = new List<SqlParameter>()
                    {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPreferentialPlan},
                        new SqlParameter("@expirationDate", SqlDbType.DateTime) {Value = expirationDatePublication},
                    };
                    updateCommandPubl.Parameters.AddRange(prmPubl.ToArray());
                    updateCommandPubl.Transaction = objTrans;
                    updateCommandPubl.ExecuteNonQuery();
                }
                objTrans.Commit();
                // Update also all child preferential payments state and expiration date
                List<int> childPublicationsId = GetChildPublications(idPublication, con, objTrans);
                if (childPublicationsId.Count != 0 && approved)
                {
                    foreach (int idPublicationChild in childPublicationsId)
                    {
                        int idPaymentChild = GetIdPreferentialPayment(idPublicationChild, con, objTrans);
                        if (idPaymentChild != 0)
                        {
                            //If there is already a preferential payment created for child publication -> update
                            int price = GetPriceByPlanId(idPreferentialPlan, con, objTrans);
                            UpdatePreferentialPlanUpgraded(idPublicationChild, idPreferentialPlan, price, con, objTrans);
                        }
                        else
                        {
                            // Create
                            int idPaymentParent = GetIdPreferentialPayment(idPublication, con, objTrans);
                            CreatePreferentialPayment(idPublicationChild, idPublication, idPreferentialPlan, con, objTrans);
                        }
                    }
                }
                UserBasicData user = GetPublisherFromPublication(idPublication, con);
                return user;
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
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

        /// <summary>
        /// Returns all child publications of a parent publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <param name="objTrans"></param>
        /// <returns> Child publications </returns>
        private List<int> GetChildPublications(int idPublication, SqlConnection con, SqlTransaction objTrans)
        {
            List<int> childPublications = new List<int>();
            String query = cns.GetChildPublications();
            SqlCommand selectCommand = new SqlCommand(query, con);
            SqlParameter param = new SqlParameter()
            {
                ParameterName = "@idPublication",
                Value = idPublication,
                SqlDbType = SqlDbType.Int
            };
            selectCommand.Parameters.Add(param);
            selectCommand.Transaction = objTrans;
            SqlDataReader dr = selectCommand.ExecuteReader();
            int idChildPublication;
            while (dr.Read())
            {
                idChildPublication = Convert.ToInt32(dr["idChildPublication"]);
                childPublications.Add(idChildPublication);
            }
            dr.Close();
            return childPublications;
        }

        /// <summary>
        /// Approves/reject commission payment
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="approved"></param>
        /// <param name="rejectedReason"></param>
        /// <returns> Publisher info </returns>
        public UserBasicData UpdatePaymentCommissionAdmin(int idReservation, bool approved, string rejectedReason)
        {
            SqlConnection con = null;
            string rejectedReasonAux = "";
            if (rejectedReason != null)
            {
                rejectedReasonAux = rejectedReason;
            }
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                string query = cns.UpdatePaymentCommissionAdmin(rejectedReason);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                    new SqlParameter("@commissionPaymentState", SqlDbType.Int) {Value =  approved ? PAYMENT_PAID_STATE : PAYMENT_REJECTED_STATE},
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation},
                    new SqlParameter("@paymentCommissionRejectedReason", SqlDbType.VarChar) {Value = rejectedReasonAux},
                    };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
                UserBasicData user = GetPublisherFromReservation(idReservation, con);
                return user;
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

        /// <summary>
        /// Returns all messages sent (by publisher or by customer)
        /// </summary>
        /// <param name="isPublisher"></param>
        /// <param name="idUser"></param>
        /// <returns> Messages s</returns>
        public List<Message> GetMessages(bool isPublisher, long idUser)
        {
            List<Message> messages = new List<Message>();
            SqlConnection con = null;
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                // 1: check for questions made by customer
                String query = cns.GetQuestionsByCustomer();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idUser",
                    Value = idUser,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                Message question;
                while (dr.Read())
                {
                    // 2: get answer for each question, if any
                    Answer answer = GetAnswer(con, Convert.ToInt32(dr["idQuestion"]));
                    string creationDate = Util.ConvertDateToString(Convert.ToDateTime(dr["creationDate"]));
                    question = new Message(Convert.ToInt32(dr["idPublication"]), Convert.ToString(dr["title"]), false, Convert.ToInt32(dr["idQuestion"]), Convert.ToString(dr["name"]), Convert.ToString(dr["question"]), creationDate, answer);
                    messages.Add(question);
                }
                dr.Close();
                //3: If is a publisher, check for questions made in every publication
                if (isPublisher)
                {
                    String queryPub = cns.GetPublicationsPublisher();
                    SqlCommand selectCommandPub = new SqlCommand(queryPub, con);
                    SqlParameter paramPub = new SqlParameter()
                    {
                        ParameterName = "@idUser",
                        Value = idUser,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommandPub.Parameters.Add(paramPub);
                    int idPublication;
                    SqlDataReader drPub = selectCommandPub.ExecuteReader();
                    while (drPub.Read())
                    {
                        idPublication = Convert.ToInt32(drPub["idPublication"]);
                        String queryQuestions = cns.GetQuestionsByPublication();
                        SqlCommand selectCommandQuestion = new SqlCommand(queryQuestions, con);
                        SqlParameter paramQuestion = new SqlParameter()
                        {
                            ParameterName = "@idPublication",
                            Value = idPublication,
                            SqlDbType = SqlDbType.Int
                        };
                        selectCommandQuestion.Parameters.Add(paramQuestion);
                        SqlDataReader drQuestion = selectCommandQuestion.ExecuteReader();
                        while (drQuestion.Read())
                        {
                            int idQuestion = Convert.ToInt32(drQuestion["idQuestion"]);
                            Answer answer = GetAnswer(con, idQuestion);
                            string creationDate = Util.ConvertDateToString(Convert.ToDateTime(drQuestion["creationDate"]));
                            question = new Message(Convert.ToInt32(drPub["idPublication"]), Convert.ToString(drQuestion["title"]), true, Convert.ToInt32(drQuestion["idQuestion"]), Convert.ToString(drQuestion["name"]), Convert.ToString(drQuestion["question"]), creationDate, answer);
                            messages.Add(question);
                        }
                        drQuestion.Close();
                    }
                    dr.Close();
                }
                if (messages.Count != 0)
                {
                   messages.Sort();
                }                
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());

            }
            return messages;
        }

        /// <summary>
        /// Given a question id, returns its answer
        /// </summary>
        /// <param name="con"></param>
        /// <param name="idQuestion"></param>
        /// <returns> Answer </returns>
        private Answer GetAnswer(SqlConnection con, int idQuestion)
        {
            Answer answer = null;
            String queryAnswers = cns.GetAnswers();
            SqlCommand selectCommandAnswers = new SqlCommand(queryAnswers, con);
            SqlParameter paramAnswers = new SqlParameter()
            {
                ParameterName = "@idQuestion",
                Value = idQuestion,
                SqlDbType = SqlDbType.Int
            };
            selectCommandAnswers.Parameters.Add(paramAnswers);
            SqlDataReader drAnswer = selectCommandAnswers.ExecuteReader();
            while (drAnswer.Read())
            {
                string creationDateAnswer = Util.ConvertDateToString(Convert.ToDateTime(drAnswer["creationDate"]));
                answer = new Answer(Convert.ToString(drAnswer["answer"]), creationDateAnswer);
            }
            drAnswer.Close();
            return answer;
        }

        /// <summary>
        /// Given a publication plan id, returns publication plan description
        /// </summary>
        /// <param name="idPlan"></param>
        /// <returns> Publication plan description </returns>
        public string GetPublicationPlanById(int idPlan)
        {
            SqlConnection con = null;
            string description = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
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
                while (drPlan.Read())
                {
                    description = Convert.ToString(drPlan["name"]);
                }
                drPlan.Close();
                return description;
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

        /// <summary>
        /// Given a question id, return publication title
        /// </summary>
        /// <param name="idQuestion"></param>
        /// <returns> Publication title </returns>
        public string GetPublicationTitleByQuestionId(int idQuestion)
        {
            SqlConnection con = null;
            String title = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationByQuestionId();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idQuestion",
                    Value = idQuestion,
                    SqlDbType = SqlDbType.Int
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    title = Convert.ToString(dr["title"]);
                }
                dr.Close();
                return title;
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

        /// <summary>
        /// Given a reservation id, returns publication title
        /// </summary>
        /// <param name="idReservation"></param>
        /// <returns> Publication title</returns>
        public string GetPublicationTitleByReservationId(int idReservation)
        {
            SqlConnection con = null;
            String title = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationTitleByReservationId();
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
                    title = Convert.ToString(dr["title"]);
                }
                dr.Close();
                return title;
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

        /// <summary>
        /// Updates commission amount to be paid
        /// </summary>
        /// <param name="idReservation"></param>
        /// <param name="price"></param>
        public void UpdateCommissionAmountAdmin(int idReservation, int price)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                bool isPaid = price == 0 ? true : false;
                String query = cns.UpdateCommissionAmountAdmin(isPaid);
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> param = new List<SqlParameter>()
                {
                    new SqlParameter("@commission", SqlDbType.Int) {Value =  price},
                    new SqlParameter("@idReservation", SqlDbType.Int) {Value = idReservation}
                };
                updateCommand.Parameters.AddRange(param.ToArray());
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

        /// <summary>
        /// Returns reservation plan description depending on language and amount of hours/days/weeks/months/
        /// </summary>
        /// <param name="idPlan"></param>
        /// <param name="language"></param>
        /// <param name="plural"></param>
        /// <returns> Reservation plan description </returns>
        public string GetReservationPlanDescriptionEmail(int idPlan, int language, bool plural)
        {
            String description = "";
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetReservationPlanDescription();
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> param = new List<SqlParameter>()
                {
                    new SqlParameter("@idPlan", SqlDbType.Int) {Value = idPlan},
                    new SqlParameter("@language", SqlDbType.Int) {Value = language},
                    new SqlParameter("@plural", SqlDbType.Bit) {Value = plural},
                };
                selectCommand.Parameters.AddRange(param.ToArray());
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    description = Convert.ToString(dr["description"]);
                }
                dr.Close();
                return description;
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

        /// <summary>
        /// Returns all reservations
        /// </summary>
        /// <returns> Reservations </returns>
        public List<ReservationExtended> GetReservations()
        {
            {
                List<ReservationExtended> reservations = new List<ReservationExtended>();
                ReservationExtended reservation = null;
                SqlConnection con = null;
                try
                {
                    con = new SqlConnection(GetConnectionString());
                    con.Open();

                    String query = cns.GetAllReservations();
                    SqlCommand selectCommand = new SqlCommand(query, con);
                    SqlDataReader dr = selectCommand.ExecuteReader();
                    while (dr.Read())
                    {
                        Payment payment = GetReservationPaymentInfo(Convert.ToInt32(dr["idReservation"]), con);
                        String dateConvertedFrom = Util.ConvertDateToString(Convert.ToDateTime(dr["dateFrom"]));
                        DateTime dateTo = Convert.ToDateTime(dr["dateTo"] is DBNull ? null : dr["dateTo"]);
                        String dateConvertedTo = "";
                        if (DEFAULT_DATE_TIME != dateTo)
                        {
                            dateConvertedTo = Util.ConvertDateToString(Convert.ToDateTime(dr["dateTo"]));
                        }
                        reservation = new ReservationExtended(Convert.ToInt32(dr["idReservation"]), Convert.ToString(dr["title"]), Convert.ToInt32(dr["idPublication"]),
                            Convert.ToString(dr["customerMail"]), Convert.ToString(dr["planSelected"]),
                            Convert.ToInt32(dr["reservedQty"] is DBNull ? 0 : dr["reservedQty"]), Convert.ToDateTime(dr["dateFrom"]), dateConvertedFrom, dateTo, dateConvertedTo, Convert.ToString(dr["hourFrom"]),
                            Convert.ToString(dr["hourTo"]), Convert.ToInt32(dr["people"] is DBNull ? 0 : dr["people"]), null,
                            Convert.ToInt32(dr["totalPrice"]), Convert.ToInt32(dr["state"]), Convert.ToString(dr["description"]), false, 0,
                            0, 0, 0, false, payment, null, null, Convert.ToString(dr["publisherMail"]));
                        reservations.Add(reservation);
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
                return reservations;
            }
        }

        /// <summary>
        /// Updates publications state to finished.
        /// </summary>
        /// <returns> Publisher info </returns>
        public List<EmailData> FinishPublications()
        {
            List<EmailData> publications = new List<EmailData>();
            EmailData emailData = null;
            SqlConnection con = null;
            int idPublication;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.FinishPublications();
                SqlCommand updateCommand = new SqlCommand(query, con);
                SqlDataReader dr = updateCommand.ExecuteReader();
                while (dr.Read())
                {
                    idPublication = Convert.ToInt32(dr["idPublication"]);
                    String queryInfo = cns.GetPublicationNameMail();
                    SqlCommand selectCommand = new SqlCommand(queryInfo, con);
                    SqlParameter param = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idPublication,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommand.Parameters.Add(param);
                    SqlDataReader drInfo = selectCommand.ExecuteReader();
                    while (drInfo.Read())
                    {
                        emailData = new EmailData(Convert.ToString(drInfo["mail"]), Convert.ToString(drInfo["name"]), Convert.ToInt32(drInfo["language"]), null, null, 0, Convert.ToString(drInfo["title"]));
                    }
                    drInfo.Close();
                    publications.Add(emailData);
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
            return publications;
        }

        /// <summary>
        /// Updates reservations state to finished
        /// </summary>
        /// <returns> Publisher and customer info </returns>
        public List<EmailData> FinishReservations()
        {
            List<EmailData> reservations = new List<EmailData>();
            EmailData emailData = null;
            SqlConnection con = null;
            int idReservation;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.FinishReservations();
                SqlCommand updateCommand = new SqlCommand(query, con);
                SqlDataReader dr = updateCommand.ExecuteReader();
                while (dr.Read())
                {
                    idReservation = Convert.ToInt32(dr["idReservation"]);
                    String queryInfo = cns.GetReservationNameMail();
                    SqlCommand selectCommand = new SqlCommand(queryInfo, con);
                    SqlParameter param = new SqlParameter()
                    {
                        ParameterName = "@idReservation",
                        Value = idReservation,
                        SqlDbType = SqlDbType.Int
                    };
                    selectCommand.Parameters.Add(param);
                    SqlDataReader drInfo = selectCommand.ExecuteReader();
                    while (drInfo.Read())
                    {
                        emailData = new EmailData(Convert.ToString(drInfo["publisherMail"]), Convert.ToString(drInfo["publisherName"]), Convert.ToInt32(drInfo["publisherLanguage"]),
                            Convert.ToString(drInfo["customerMail"]), Convert.ToString(drInfo["customerName"]), Convert.ToInt32(drInfo["customerLanguage"]), Convert.ToString(drInfo["title"]));
                    }
                    drInfo.Close();
                    reservations.Add(emailData);
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
            return reservations;
        }

        /// <summary>
        /// Updates reservation state to In progress
        /// </summary>
        public void StartReservation()
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.StartReservation();
                SqlCommand updateCommand = new SqlCommand(query, con);
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

        /// <summary>
        /// Returns all asociated publications of a publication 
        /// Can be parent publication, child publications, siblings publications
        /// </summary>
        /// <param name="idPublication"></param>
        /// <returns> Publications </returns>
        public List<Publication> GetOtherPublicationConfig(int idPublication)
        {
            List<Publication> otherPublications = new List<Publication>();
            SqlConnection con = null;
            Util util = new Util();
            try
            {
                List<int> idOtherPublications = GetIdOtherPublicationConfig(idPublication);
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (idOtherPublications.Count != 0)
                {
                    foreach (int idOtherPublication in idOtherPublications)
                    {
                        Publication publication;
                        List<String> images = new List<string>();
                        String queryImages = cns.GetImages();
                        SqlCommand selectCommandImages = new SqlCommand(queryImages, con);
                        SqlParameter parametroImages = new SqlParameter()
                        {
                            ParameterName = "@idPublication",
                            Value = idOtherPublication,
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

                        String queryOtherPub = cns.GetOtherPublicationConfig();
                        SqlCommand selectOtherPub = new SqlCommand(queryOtherPub, con);
                        SqlParameter param = new SqlParameter()
                        {
                            ParameterName = "@idPublication",
                            Value = idOtherPublication,
                            SqlDbType = SqlDbType.Int
                        };
                        selectOtherPub.Parameters.Add(param);
                        SqlDataReader drOtherpub = selectOtherPub.ExecuteReader();
                        while (drOtherpub.Read())
                        {
                            publication = new Publication(idOtherPublication, 0, null, null, null, null, 0, null, null, Convert.ToString(drOtherpub["title"]), Convert.ToString(drOtherpub["description"]), null,
                            null, Convert.ToInt32(drOtherpub["capacity"]), null, Convert.ToInt32(drOtherpub["hourPrice"]),
                            Convert.ToInt32(drOtherpub["dailyPrice"]), Convert.ToInt32(drOtherpub["weeklyPrice"]), Convert.ToInt32(drOtherpub["monthlyPrice"]),
                            Convert.ToString(drOtherpub["availability"]), null, images, null, 0, null, 0, Convert.ToString(drOtherpub["city"]),
                            Convert.ToInt32(drOtherpub["totalViews"]), false, 0, false, 0, null, false, 0, false);
                            otherPublications.Add(publication);
                        }
                        drOtherpub.Close();
                    }                
                }
                return otherPublications;
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
        }

        /// <summary>
        /// Returns publication id of asociated publications 
        /// </summary>
        /// <param name="idPublication"></param>
        /// <returns></returns>
        private List<int> GetIdOtherPublicationConfig(int idPublication)
        {
            SqlConnection con = null;
            List<int> idOtherPublications = new List<int>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String queryChild = cns.GetIdChildPublicationConfig();
                SqlCommand selectChildCommand = new SqlCommand(queryChild, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@idPublication",
                    Value = idPublication,
                    SqlDbType = SqlDbType.Int
                };
                selectChildCommand.Parameters.Add(param);
                SqlDataReader dr = selectChildCommand.ExecuteReader();
                int idOtherPublication;
                bool isParentPublication = false;
                while (dr.Read())
                {
                    // If there are child publications for idPublication, means that idPublication is father
                    isParentPublication = true;
                    idOtherPublication = Convert.ToInt32(dr["idChildPublication"]);
                    idOtherPublications.Add(idOtherPublication);
                }
                if (!isParentPublication)
                {
                    // Need to find parent publication and their childs
                    int idParent = GetIdParentPublicationConfig(idPublication, con);
                    idOtherPublication = idParent;
                    idOtherPublications.Add(idParent);
                    //Childs
                    String queryParentChild = cns.GetIdChildPublicationConfig();
                    SqlCommand selectParentChildCommand = new SqlCommand(queryParentChild, con);
                    SqlParameter paramParentChild = new SqlParameter()
                    {
                        ParameterName = "@idPublication",
                        Value = idParent,
                        SqlDbType = SqlDbType.Int
                    };
                    selectParentChildCommand.Parameters.Add(paramParentChild);
                    SqlDataReader drParentChild = selectParentChildCommand.ExecuteReader();
                    while (drParentChild.Read())
                    {
                        idOtherPublication = Convert.ToInt32(drParentChild["idChildPublication"]);
                        if (idOtherPublication != idPublication)
                        {
                            // Not add same idPublication
                            idOtherPublications.Add(idOtherPublication);
                        }
                        
                    }
                    drParentChild.Close();
                }
                dr.Close();
                return idOtherPublications;
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

        /// <summary>
        /// Returns publication parent id of child publication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="con"></param>
        /// <returns> Publication parent id </returns>
        private int GetIdParentPublicationConfig(int idPublication, SqlConnection con)
        {
            int idParent = 0;
            String queryParent = cns.GetIdParentPublicationConfig();
            SqlCommand selectParentCommand = new SqlCommand(queryParent, con);
            SqlParameter paramParent = new SqlParameter()
            {
                ParameterName = "@idChildPublication",
                Value = idPublication,
                SqlDbType = SqlDbType.Int
            };
            selectParentCommand.Parameters.Add(paramParent);
            SqlDataReader drParent = selectParentCommand.ExecuteReader();
            if (drParent.HasRows)
            {
                while (drParent.Read())
                {
                    idParent = Convert.ToInt32(drParent["idPublication"]);
                }
                drParent.Close();
            }
            return idParent;
        }
    }
}
