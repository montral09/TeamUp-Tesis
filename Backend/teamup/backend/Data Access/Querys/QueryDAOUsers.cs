using System;

namespace backend.Data_Access.Query
{
    public class QueryDAOUsers
    {
        public String Member()
        {
            String query = "select idUser from USERS where mail=@mail and active = 1";
            return query;
        }

        public String UserValidated()
        {
            String query = "select idUser from USERS where mail=@mail and mailValidated = 1";
            return query;
        }

        public String User()
        {
            String query = "select idUser,mail,name,lastName,password,phone,rut,razonSocial,address,checkPublisher,mailValidated,publisherValidated,active from USERS where mail=@mail";
            return query;
        }

        public String InsertUser()
        {
            String query = "insert into USERS (mail, name, lastName, password, phone, checkPublisher, rut, razonSocial, address, mailValidated, publisherValidated, active) values(@mail, @name, @lastName, @password, @phone, @checkPublisher, @rut, @razonSocial, @address, 0, 0, 1) ";
            return query;
        }
        public String UpdatePassword()
        {
            String query = "update USERS set password = @password WHERE mail = @mail ";
            return query;
        }
        public String UpdateUser()
        {
            String query = "update USERS set mail = @mail, name = @name, lastName = @lastName, phone = @phone, rut = @rut, razonSocial = @razonSocial, address = @address WHERE idUser = @idUser ";
            return query;
        }

        public String DeleteUser()
        {
            String query = "update USERS set active = 0 WHERE mail = @mail ";
            return query;
        }

        public String InvalidateMail()
        {
            String query = "update USERS set mailValidated = 0 where mail = @mail";
            return query;
        }

        public String GetPublishers()
        {
            String query = "select * from USERS  WHERE checkPublisher = 1 and active = 1";
            return query;
        }

        public String GetCustomers()
        {
            String query = "select * from USERS  WHERE checkPublisher = 0 and active = 1";
            return query;
        }

        public String ApprovePublishers()
        {
            String query = "update USERS set publisherValidated = 1 where mail = @publisherMail";
            return query;
        }

        public String GetAdmin()
        {
            String query = "select mail, password, name, lastName, phone from USERS where mail=@mail";
            return query;
        }

        public String GetMail()
        {
            String query = "select mail from USERS where idUser=@idUser";
            return query;
        }

        public String RequestPublisher()
        {
            String query = "update USERS set checkPublisher = 1 where mail = @customerMail";
            return query;
        }

        public String InsertActivationCode()
        {
            String query = "update USERS set activationCode=@activationCode where mail=@mail";
            return query;
        }

        public String CreateTokens()
        {
            String query = "update USERS set accessToken=@accessToken, accessTokenExpiration=@accessTokenExpiration," +
                " refreshToken=@refreshToken, refreshTokenExpiration=@refreshTokenExpiration where mail = @mail";
            return query;
        }
        public String ValidateEmail()
        {
            String query = "update USERS set activationCode=null, mailValidated=1 where activationCode=@activationCode";
            return query;
        }

        public String UpdateUserAdmin()
        {
            String query = "update USERS set mail = @mail, name = @name, lastName = @lastName, phone = @phone, checkPublisher=@checkPublisher, rut = @rut, razonSocial = @razonSocial, address = @address, mailValidated=@mailValidated, publisherValidated=@publisherValidated WHERE idUser = @idUser ";
            return query;
        }
    }
     
}
