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
                    voSpaceType = new VOSpaceType(Convert.ToInt32(dr["idSpaceType"]), Convert.ToString(dr["description"]));
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

        public async Task CreatePublication(VORequestCreatePublication voCreatePublication, User user)
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
                //String images = Util.CreateStringImages(voCreatePublication.VOPublication.Images);
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@idUser", SqlDbType.VarChar) {Value = user.IdUser},
                        new SqlParameter("@spaceType", SqlDbType.Int) {Value = voCreatePublication.VOPublication.SpaceType},
                        new SqlParameter("@title", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Title},
                        new SqlParameter("@description", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Description},
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
                        new SqlParameter("@state", SqlDbType.VarChar) {Value = TeamUpConstants.PUBLICATION_CREATED}
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());                
                insertCommand.Transaction = objTrans;
                int idPublication = Convert.ToInt32(insertCommand.ExecuteScalar());
                // Store images
                StorageUtil storageUtil = new StorageUtil();
                storageUtil.StoreImage(voCreatePublication.VOPublication.Images, user.IdUser, idPublication);
                // Send email to publisher
                string subject = "Publication created";
                string body = Util.CreateBodyEmailNewPublicationToPublisher(user.Name);
                Util util = new Util();
                await util.SendEmailAsync(mail, body, subject);
                // Send email to admin
                string adminEmail = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                string bodyAdmin = Util.CreateBodyEmailNewPublicationToAdmin(mail);
                await util.SendEmailAsync(adminEmail, bodyAdmin, subject);
                
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

        public List<VOPublication> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval)
        {
            SqlConnection con = null;
            List<VOPublication> publications = new List<VOPublication>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublicationsPendingApproval();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                VOPublication voPublication;
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    images.Add("https://s3-eu-west-1.amazonaws.com/worktel.files/aaee923a-3c7a-4c1a-9db9-5bbc15c903b4.jpeg");
                    images.Add("https://s3-eu-west-1.amazonaws.com/worktel.files/a162187c-07b2-4c51-b77f-f12d00230474.jpg");
                    images.Add("https://s3-eu-west-1.amazonaws.com/worktel.files/1fd01252-22c5-4e25-8133-2998c524cf8e.JPG");
                    StorageUtil storageUtil = new StorageUtil();
                    //images = storageUtil.GetImagesPublication(Convert.ToInt64(dr["idUser"]), Convert.ToInt32(dr["idPublication"]), Convert.ToString(dr["images"]));                    
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    Util util = new Util();
                    List<int> facilities = util.ConvertFacilities(facilitiesString);
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["mail"]),
                        Convert.ToString(dr["phone"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images);
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
    }
}
