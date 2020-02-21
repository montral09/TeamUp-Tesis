using System;
using System.Text;

namespace backend.Data_Access.Query
{
    public class QueryDAOUsers
    {
        public String Member()
        {
            String query = "select idUser from USERS where mail=@mail and active = 1";
            return query;
        }
        public String AdminMember()
        {
            String query = "select idAdmin from ADMIN where mail=@mail";
            return query;
        }
        public String UserValidated()
        {
            String query = "select idUser from USERS where mail=@mail and mailValidated = 1";
            return query;
        }

        public String User()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u.idUser, u.mail, u.name, u.lastName, u.password, u.phone, u.rut, u.razonSocial, u.address, ");
            query.Append("u.checkPublisher, u.mailValidated, u.publisherValidated, u.active, l.description, l.idLanguage ");
            query.Append("from USERS u, LANGUAGES l where mail=@mail and u.language = l.idlanguage");
            return query.ToString();
        }

        public String InsertUser()
        {
            String query = "insert into USERS (mail, name, lastName, password, phone, checkPublisher, rut, razonSocial, address, mailValidated, publisherValidated, active, activationCode, language) values(@mail, @name, @lastName, @password, @phone, @checkPublisher, @rut, @razonSocial, @address, 0, 0, 1, @activationCode, @language) ";
            return query;
        }
        public String UpdatePassword()
        {
            String query = "update USERS set password = @password WHERE mail = @mail ";
            return query;
        }
        public String UpdateUser()
        {
            StringBuilder query = new StringBuilder();
            query.Append("update USERS set mail = @mail, name = @name, lastName = @lastName, phone = @phone, rut = @rut, ");
            query.Append("razonSocial = @razonSocial, address = @address, language = @language WHERE idUser = @idUser ");
            return query.ToString();
        }

        public String DeleteUser()
        {
            String query = "update USERS set active = 0 WHERE mail = @mail ";
            return query;
        }

        public String InvalidateMail()
        {
            String query = "update USERS set mailValidated = 0, activationCode = @activationCode where mail = @mail";
            return query;
        }

        public String GetPublishers()
        {
            String query = "select * from USERS  WHERE checkPublisher = 1 and active = 1";
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
            StringBuilder query = new StringBuilder();
            query.Append("update USERS set accessToken=@accessToken, accessTokenExpiration=@accessTokenExpiration, ");
            query.Append("refreshToken=@refreshToken, refreshTokenExpiration=@refreshTokenExpiration where mail = @mail");
            return query.ToString();
        }
        public String ValidateEmail()
        {
            String query = "update USERS set activationCode=null, mailValidated=1 where activationCode=@activationCode";
            return query;
        }

        public String UpdateUserAdmin()
        {
            StringBuilder query = new StringBuilder();
            query.Append("update USERS set mail = @mail, name = @name, lastName = @lastName, phone = @phone, ");
            query.Append("checkPublisher=@checkPublisher, rut = @rut, razonSocial = @razonSocial, address = @address, ");
            query.Append("mailValidated=@mailValidated, publisherValidated=@publisherValidated, active=@active WHERE idUser = @idUser");
            return query.ToString();
        }

        public String GetUsers()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select idUser, mail, name, lastName, phone, checkPublisher, rut, razonSocial, address, ");
            query.Append("mailValidated, publisherValidated,active from USERS");
            return query.ToString();
        }

        public String UpdateActivationCode()
        {
            String query = "update USERS set activationCode=@activationCode and mailValidated = 0 where mail=@mail";
            return query;
        }

        public String GetUserData()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select idUser, mail, name, lastName, password, phone, rut, razonSocial, address, ");
            query.Append("checkPublisher, mailValidated, publisherValidated, active from USERS where accessToken=@accessToken");
            return query.ToString();
        }

        public String IsPublisher()
        {
            String query = "select idUser from USERS where mail = @mail and publisherValidated = 1 and active = 1";
            return query;
        }

        public String CheckPendingReservation()
        {
            String query = "select idReservation from RESERVATIONS where idCustomer = @idCustomer and state in (1,2,3)";
            return query;
        }

        public String CheckPendingReservationPayment()
        {
            String query = "select idReservation from RESERVATIONS where idCustomer = @idCustomer and paymentCustomerState in (1,2)";
            return query;
        }

        public String CheckPendingPublications()
        {
            String query = "select idPublication from PUBLICATIONS where idUser = @idUser and state in (1,2,3,4)";
            return query;
        }

        public String CheckPendingReservationPublisher()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select r.idPublication from RESERVATIONS r, PUBLICATIONS p where r.state in (1,2,3) and ");
            query.Append("r.idPublication = p.idPublication and p.idUser = @idUser");                        
            return query.ToString();
        }

        public String CheckPendingPreferentialPayment()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select pp.idPrefPayments from PREFERENTIAL_PAYMENTS pp, PUBLICATIONS P where ");
            query.Append("pp.state in (1,2) and pp.idPublication = p.idPublication and p.idUser = @idUser");
            return query.ToString();
        }

        public String CheckPendingCommissionPayment()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select r.idReservation from RESERVATIONS r, PUBLICATIONS p where ");
            query.Append("r.idPublication = p.idPublication and p.idUser = @idUser and r.commissionPaymentState in (1,2)");
            return query.ToString();
        }

        public String GetIdLanguageByDescription()
        {
            String query = "select idLanguage from LANGUAGES where description = @description";
            return query;
        }

        public String InsertDeviceToken()
        {
            String query = "update USERS set deviceToken = @deviceToken where mail = @mail";
            return query;
        }

        public String GetDeviceToken()
        {
            String query = "select deviceToken from USERS where mail = @mail";
            return query;
        }
    }
     
}
