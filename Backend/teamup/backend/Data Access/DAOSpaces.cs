using backend.Data_Access.Query;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
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
        public DAOSpaces()
        {
            cns = new QueryDAOSpaces();
        }
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }

        public List<VOLocation> GetLocations()
        {
            SqlConnection con = null;
            List<VOLocation> locations = new List<VOLocation>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetLocations();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOLocation vOLocation;
                while (dr.Read())
                {
                    vOLocation = new VOLocation(Convert.ToInt32(dr["idLocation"]), Convert.ToString(dr["description"]));
                    locations.Add(vOLocation);
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
            return locations;
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
                    voFacility = new VOFacility(Convert.ToInt32(dr["idFacility"]), Convert.ToString(dr["description"]));
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
                        new SqlParameter("@city", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.City}
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());                
                insertCommand.Transaction = objTrans;
                int idPublication = Convert.ToInt32(insertCommand.ExecuteScalar());
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
                    voPublication = new VOPublicationAdmin(Convert.ToInt32(dr["idPublication"]), Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]),
                         Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, TeamUpConstants.NOT_VALIDATED, Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]));
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
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    String facilitiesString = Convert.ToString(dr["facilities"]);
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
                    while (drImages.Read())
                    {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    List<VOReview> reviews = GetReviews(idPublication, con);
                    int ranking = util.GetRanking(reviews);
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, Convert.ToString(dr["state"]), 4, reviews, ranking);
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

       public VOPublication GetSpace(int idSpace)
        {
            VOPublication voPublication = null;
            SqlConnection con = null;
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

                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]), 
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null, 4, reviews, ranking);                    
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

        public VOPublicationAdmin UpdateStatePublication(int idPublication, string rejectedReason, int newCodeState, bool isAdmin)
        {
            VOPublicationAdmin voPublication = null;
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
                        voPublication = new VOPublicationAdmin(idPublication, Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]),
                         0, Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]),null, null,
                        null, 0, null, 0,
                        0, 0, 0, null, null, null, null, Convert.ToString(dr["name"]), null,null);
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
            int MAX_PUBLICATIONS_PAGE = Convert.ToInt32(ConfigurationManager.AppSettings["MAX_PUBLICATIONS_PAGE"]);
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
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null, 4, reviews, ranking);
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
                    voReview = new VOReview(Convert.ToInt32(dr["idUser"]), Convert.ToString(dr["name"]), Convert.ToInt32(dr["rating"]), Convert.ToString(dr["review"]));                   
                    reviews.Add(voReview);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }            
            return reviews;
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
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]), Convert.ToString(dr["address"]), Convert.ToString(dr["city"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null, 4, reviews, ranking);
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
                    queryImages = cns.DeleteImages();
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
    }
}
