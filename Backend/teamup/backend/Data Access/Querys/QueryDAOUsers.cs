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
            String query = "select u.idUser, u.mail, u.name, u.lastName, u.password, u.phone, u.rut, u.razonSocial, u.address, u.checkPublisher, u.mailValidated, u.publisherValidated, u.active, l.description, l.idLanguage from USERS u, LANGUAGES l where " +
                "mail=@mail and u.language = l.idlanguage";
            return query;
        }

        public String InsertUser()
        {
            String query = "insert into USERS (mail, name, lastName, password, phone, checkPublisher, rut, razonSocial, address, mailValidated, publisherValidated, active, language) values(@mail, @name, @lastName, @password, @phone, @checkPublisher, @rut, @razonSocial, @address, 0, 0, 1, @language) ";
            return query;
        }
        public String UpdatePassword()
        {
            String query = "update USERS set password = @password WHERE mail = @mail ";
            return query;
        }
        public String UpdateUser()
        {
            String query = "update USERS set mail = @mail, name = @name, lastName = @lastName, phone = @phone, rut = @rut, razonSocial = @razonSocial, address = @address, language = @language WHERE idUser = @idUser ";
            return query;
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
            String query = "update USERS set mail = @mail, name = @name, lastName = @lastName, phone = @phone, checkPublisher=@checkPublisher, rut = @rut, razonSocial = @razonSocial, address = @address, mailValidated=@mailValidated, publisherValidated=@publisherValidated, active=@active WHERE idUser = @idUser ";
            return query;
        }

        public String GetUsers()
        {
            String query = "select idUser,mail,name,lastName,phone,checkPublisher,rut,razonSocial,address,mailValidated,publisherValidated,active from USERS";
            return query;
        }

        public String UpdateActivationCode()
        {
            String query = "update USERS set activationCode=@activationCode and mailValidated = 0 where mail=@mail";
            return query;
        }

        public String GetUserData()
        {
            String query = "select idUser,mail,name,lastName,password,phone,rut,razonSocial,address,checkPublisher,mailValidated,publisherValidated,active from USERS where accessToken=@accessToken";
            return query;
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
            String query = "select r.idPublication from RESERVATIONS r, PUBLICATIONS p where r.state in (1,2,3) and " +
                "r.idPublication = p.idPublication and p.idUser = @idUser";
            return query;
        }

        public String CheckPendingPreferentialPayment()
        {
            String query = "select pp.idPrefPayments from PREFERENTIAL_PAYMENTS pp, PUBLICATIONS P where " +
                "pp.state in (1,2) and pp.idPublication = p.idPublication and p.idUser = @idUser";
            return query;
        }

        public String CheckPendingCommissionPayment()
        {
            String query = "select r.idReservation from RESERVATIONS r, PUBLICATIONS p where " +
                "r.idPublication = p.idPublication and p.idUser = @idUser and r.commissionPaymentState in (1,2)";
            return query;
        }

        public String GetIdLanguageByDescription()
        {
            String query = "select idLanguage from LANGUAGES where description = @description";
            return query;
        }
    }
     
}
