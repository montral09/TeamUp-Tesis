﻿using backend.Data_Access.Query;
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
                        new SqlParameter("@locationLat", SqlDbType.Decimal) {Value = voCreatePublication.VOPublication.Location.Latitude},
                        new SqlParameter("@locationLong", SqlDbType.Decimal) {Value = voCreatePublication.VOPublication.Location.Longitude},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = voCreatePublication.VOPublication.Capacity},
                        new SqlParameter("@videoURL", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.VideoURL},
                        new SqlParameter("@hourPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.HourPrice},
                        new SqlParameter("@dailyPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.DailyPrice},
                        new SqlParameter("@weeklyPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.WeeklyPrice},
                        new SqlParameter("@monthlyPrice", SqlDbType.Int) {Value = voCreatePublication.VOPublication.MonthlyPrice},
                        new SqlParameter("@availability", SqlDbType.VarChar) {Value = voCreatePublication.VOPublication.Availability},
                        new SqlParameter("@facilities", SqlDbType.VarChar) {Value = facilities}
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
                         Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]),
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
                    while (drImages.Read())
                    {
                        string accessURL = Convert.ToString(drImages["accessURL"]);
                        images.Add(accessURL);
                    }
                    drImages.Close();
                    VOLocationCordinates voLocation = new VOLocationCordinates(Convert.ToDecimal(dr["locationLat"]), Convert.ToDecimal(dr["locationLong"]));
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, Convert.ToString(dr["state"]));
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
                    Util util = new Util();
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
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null);                    
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

        public void UpdateStatePublication(int idPublication, int newCodeState)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.UdpdateStatePublication();
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                {
                        new SqlParameter("@idPublication", SqlDbType.Int) {Value = idPublication},
                        new SqlParameter("@state", SqlDbType.Int) {Value = newCodeState}
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
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

        public VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter)
        {
            VOResponseGetPublicationsWithFilters response = new VOResponseGetPublicationsWithFilters();
            List<VOPublication> publications = new List<VOPublication>();
            VOPublication voPublication = null;
            SqlConnection con = null;
            int MAX_PUBLICATIONS_PAGE = Convert.ToInt32(ConfigurationManager.AppSettings["MAX_PUBLICATIONS_PAGE"]);
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (voGetPublicationsFilter.PageNumber == 1)
                {                    
                    int qty = 0;
                    String queryQuantity = cns.GetQuantityPublicationsWithFilter(voGetPublicationsFilter);
                    SqlCommand selectCommandQuantity = new SqlCommand(queryQuantity, con);
                    List<SqlParameter> prmQty = new List<SqlParameter>()
                    {
                        new SqlParameter("@spaceType", SqlDbType.Int) { Value = voGetPublicationsFilter.SpaceType},
                        new SqlParameter("@capacity", SqlDbType.Int) {Value = voGetPublicationsFilter.Capacity},
                    };
                    selectCommandQuantity.Parameters.AddRange(prmQty.ToArray());
                    SqlDataReader drQty = selectCommandQuantity.ExecuteReader();
                    while (drQty.Read())
                    {
                        qty = Convert.ToInt32(drQty["quantity"]);
                    }
                    drQty.Close();
                    if (qty < MAX_PUBLICATIONS_PAGE)
                    {
                        response.MaxPage = 1;
                    } else {
                        response.MaxPage = (int)Math.Floor((Double)qty / MAX_PUBLICATIONS_PAGE);
                    }
                    
                }
               
               String query = cns.GetPublicationsWithFilter(voGetPublicationsFilter, MAX_PUBLICATIONS_PAGE);
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                 {
                    new SqlParameter("@spaceType", SqlDbType.Int) { Value = voGetPublicationsFilter.SpaceType},
                    new SqlParameter("@capacity", SqlDbType.Int) {Value = voGetPublicationsFilter.Capacity},
                };
                selectCommand.Parameters.AddRange(prm.ToArray());                
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    List<String> images = new List<string>();
                    String facilitiesString = Convert.ToString(dr["facilities"]);
                    Util util = new Util();
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
                    voPublication = new VOPublication(Convert.ToInt32(dr["idPublication"]), Convert.ToInt32(dr["spaceType"]), Convert.ToDateTime(dr["creationDate"]), Convert.ToString(dr["title"]), Convert.ToString(dr["description"]),
                        voLocation, Convert.ToInt32(dr["capacity"]), Convert.ToString(dr["videoURL"]), Convert.ToInt32(dr["hourPrice"]),
                        Convert.ToInt32(dr["dailyPrice"]), Convert.ToInt32(dr["weeklyPrice"]), Convert.ToInt32(dr["monthlyPrice"]), Convert.ToString(dr["availability"]), facilities, images, null);
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
    }
}
