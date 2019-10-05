using backend.Logic;
using backend.Data_Access.Query;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
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

                if (accessToken.Equals(actualAccessToken))
                {
                    DateTime expirationDate = DateTime.Now;
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

                    if (expirationDate < DateTime.Now)
                    {
                        // Access token expired
                        result = EnumMessages.ERR_ACCESSTOKENEXPIRED.ToString();

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
                    DateTime expirationDate = DateTime.Now;
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

                    if (expirationDate < DateTime.Now)
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
