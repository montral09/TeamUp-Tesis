using backend.Logic;
using backend.Data_Access.Query;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using backend.Exceptions;

namespace backend.Data_Access
{
    public class DAOUtil : IDAOUtil
    {
        private readonly QueryDAOUtil cns;
        public DAOUtil()
        {
            cns = new QueryDAOUtil();
        }
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }

        /// <summary>
        /// Validates that the access token matches the email address
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="mail"></param>
        /// <returns> Error or success message </returns>
        public string ValidAccessToken(string accessToken, string mail)
        {            
            SqlConnection con = null;
            string actualAccessToken = "";
            string result = EnumMessages.OK.ToString();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetAccessTokenUser();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    actualAccessToken = Convert.ToString(dr["accessToken"]);
                }
                dr.Close();

                if (accessToken != null)
                {
                    if (accessToken.Equals(actualAccessToken))
                    {
                        DateTime expirationDate = DateTime.UtcNow;
                        String queryExpiration = cns.GetExpirationTimeAccessTokenUser();
                        SqlCommand selectCommandExpiration = new SqlCommand(queryExpiration, con);
                        SqlParameter parametroExpiration = new SqlParameter()
                        {
                            ParameterName = "@mail",
                            Value = mail,
                            SqlDbType = SqlDbType.VarChar
                        };
                        selectCommandExpiration.Parameters.Add(parametroExpiration);
                        SqlDataReader drExpiration = selectCommandExpiration.ExecuteReader();
                        while (drExpiration.Read())
                        {
                            expirationDate = Convert.ToDateTime(drExpiration["accessTokenExpiration"]);
                        }
                        drExpiration.Close();

                        if (expirationDate < DateTime.UtcNow)
                        {
                            // Access token expired
                            result = EnumMessages.ERR_ACCESSTOKENEXPIRED.ToString();

                        }
                    }
                    else
                    {
                        // Invalid access token
                        result = EnumMessages.ERR_INVALIDACCESSTOKEN.ToString();
                    }
                } else
                {
                    // Invalid access token
                    result = EnumMessages.ERR_INVALIDACCESSTOKEN.ToString();
                }
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
        /// Validates that the refresh token matches the email address
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <param name="mail"></param>
        /// <returns></returns>
        public string ValidRefreshToken(string refreshToken, string mail)
        {
            SqlConnection con = null;
            string actualRefreshToken = "";
            string result = EnumMessages.OK.ToString();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetRefreshTokenUser();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    actualRefreshToken = Convert.ToString(dr["refreshToken"]);
                }
                dr.Close();

                if (refreshToken.Equals(actualRefreshToken))
                {
                    DateTime expirationDate = DateTime.UtcNow;
                    String queryExpiration = cns.GetExpirationTimeRefreshTokenUser();
                    SqlCommand selectCommandExpiration = new SqlCommand(queryExpiration, con);
                    SqlParameter parameterExpiration = new SqlParameter()
                    {
                        ParameterName = "@mail",
                        Value = mail,
                        SqlDbType = SqlDbType.VarChar
                    };
                    selectCommandExpiration.Parameters.Add(parameterExpiration);
                    SqlDataReader drExpiration = selectCommandExpiration.ExecuteReader();
                    while (drExpiration.Read())
                    {
                        expirationDate = Convert.ToDateTime(drExpiration["refreshTokenExpiration"]);
                    }
                    drExpiration.Close();

                    if (expirationDate < DateTime.UtcNow)
                    {
                        // Refresh token expired
                        result = EnumMessages.ERR_REFRESHTOKENEXPIRED.ToString();

                    }
                }
                else
                {
                    // Invalid refresh token
                    result = EnumMessages.ERR_INVALIDREFRESHTOKEN.ToString();
                }
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
        /// Given an emailCode and language, returns body and subject of the email
        /// </summary>
        /// <param name="code"></param>
        /// <param name="language"></param>
        /// <returns> EmailDataGeneric </returns>
        public EmailDataGeneric GetEmailDataGeneric(string code, int language)
        {
            SqlConnection con = null;
            EmailDataGeneric data = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetEmailDataGeneric();
                SqlCommand selectCommand = new SqlCommand(query, con);
                List<SqlParameter> param = new List<SqlParameter>()
                {
                    new SqlParameter("@code", SqlDbType.VarChar) {Value = code},
                    new SqlParameter("@language", SqlDbType.Int) {Value = language},
                };
                selectCommand.Parameters.AddRange(param.ToArray());
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    data = new EmailDataGeneric(Convert.ToString(dr["subject"]), Convert.ToString(dr["body"]));
                }
                dr.Close();
                return data;
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

        /// <summary>
        /// Given a state description, returns the code
        /// </summary>
        /// <param name="state"></param>
        /// <returns> State code </returns>
        public int ConvertStatePublication(string state)
        {
            SqlConnection con = null;
            int stateCode = 0;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.ConvertStatePublication();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@state",
                    Value = state,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    stateCode = Convert.ToInt32(dr["idSpaceState"]);
                }
                dr.Close();
                return stateCode;
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

        /// <summary>
        /// Given a reservation state, returns the code
        /// </summary>
        /// <param name="state"></param>
        /// <returns> Reservation code </returns>
        public int ConvertStateReservation(string state)
        {
            SqlConnection con = null;
            int stateCode = 0;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.ConvertStateReservation();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@state",
                    Value = state,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    stateCode = Convert.ToInt32(dr["idReservationState"]);
                }
                dr.Close();
                return stateCode;
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
    }
}
