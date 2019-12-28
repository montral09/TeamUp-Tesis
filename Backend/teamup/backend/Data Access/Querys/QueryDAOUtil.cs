using System;

namespace backend.Data_Access.Query
{
    public class QueryDAOUtil
    {
        public String GetAccessTokenUser()
        {
            String query = "select accessToken from USERS where mail=@mail";
            return query;
        }

        public String GetRefreshTokenUser()
        {
            String query = "select refreshToken from USERS where mail=@mail";
            return query;
        }

        public String GetAccessTokenAdmin()
        {
            String query = "select accessToken from ADMIN where mail=@mail";
            return query;
        }

        public String GetRefreshTokenAdmin()
        {
            String query = "select refreshToken from ADMIN where mail=@mail";
            return query;
        }

        public String GetExpirationTimeAccessTokenUser()
        {
            String query = "select accessTokenExpiration from USERS where mail=@mail";
            return query;
        }

        public String GetExpirationTimeRefreshTokenUser()
        {
            String query = "select refreshTokenExpiration from USERS where mail=@mail";
            return query;
        }

        public String GetExpirationTimeAccessTokenAdmin()
        {
            String query = "select accessTokenExpiration from ADMIN where mail=@mail";
            return query;
        }

        public String GetExpirationTimeRefreshTokenAdmin()
        {
            String query = "select refreshTokenExpiration from ADMIN where mail=@mail";
            return query;
        }

        public String GetEmailDataGeneric()
        {
            String query = "select subject, body from EMAIL_FORMAT where code = @code and language = @language";
            return query;
        }
    }     
}
