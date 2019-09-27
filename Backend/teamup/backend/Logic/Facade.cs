using backend.Data_Access;
using backend.Data_Access.Query;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public class Facade: IFacadeWeb
    {
        private IDAOUsers users;
        private IDAOSpaces spaces;
        private IDAOUtil util;
        public Facade()
        {
            users = new DAOUsers();
            spaces = new DAOSpaces();
            util = new DAOUtil();
        }

        /* This function will check if the user email is exists*/
        public bool userExists(string mail)
        {
            try
            {

                if (users.Member(mail))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public bool isMailValidated (String mail)
        {
            try
            {

                if (users.isMailValidated(mail))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        /* This function will return the user or null if user/password doesn't match  */
        public VOResponseLogin ValidUserLogin(string mail, string password)
        {
            VOResponseLogin result = null;
            try
            {
                User usr = users.Find(mail);
                PasswordHasher passwordHasher = new PasswordHasher();
                if (usr != null && passwordHasher.VerifyHashedPassword(usr.Password, password))
                {
                    VOTokens voTokens = users.CreateTokens(mail);
                    result = new VOResponseLogin();
                    result.RefreshToken = voTokens.RefreshToken;
                    result.AccessToken = voTokens.AccessToken;
                    result.voUserLog = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Rut, usr.RazonSocial, usr.Address, usr.CheckPublisher);                    
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return result;
        }

        /* This function creates a new user (publisher, or customer)  */
        public void CreateUser(VORequestUserCreate voUser)
        {
            try
            {
                User u = new User(voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false, false, true);
                users.InsertUser(u);

            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        /* This function updates data from an specific user  */
        public void UpdateUser(VORequestUserUpdate voUser)
        {
            try
            {
                User u = new User(voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false, false, true);
                users.UpdateUser(u, voUser.NewMail);

            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function set user as inactive. There is no physical deletion from DB  */
        public void DeleteUser(String mail)
        {
            try
            {
                if (users.ValidateDeletion(mail))
                {
                    users.DeleteUser(mail);
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function obtains all Publishers  */
        public List<VOPublisher> GetPublishers()
        {
            List<VOPublisher> publishers = new List<VOPublisher>();
            try
            {
                publishers = users.GetPublishers();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return publishers;
        }
        /* This function obtains all Customers  */
        public List<VOCustomer> GetCustomers()
        {
            List<VOCustomer> customers = new List<VOCustomer>();
            try
            {
                customers = users.GetCustomers();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return customers;
        }
        /* This function recieve a list of Publishers to be approved  */
        public void ApprovePublishers(List<String> mails)
        {            
            try
            {
                users.ApprovePublishers(mails);
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function validate if given mail matches with some admin mail  */
        public bool AdminExists(String mail)
        {
            try
            {
                if (users.AdminExists(mail))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function returns admin user  */
        public VOAdmin GetAdmin(string mail, string password)
        {
            VOAdmin result = null;
            try
            {
                Admin usr = users.GetAdmin(mail, password);
                if (usr.Password.Equals(password))
                {                    
                    result = new VOAdmin(usr.Mail, null, usr.Name, usr.LastName, usr.Phone);
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return result;
        }

        /*This function update a customer who wants to be a publisher*/
        public void RequestPublisher(String mail)
        {
            try
            {
                users.RequestPublisher(mail);
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /*This function return all types of spaces*/
        public List<VOSpaceType> GetSpaceTypes()
        {
            List<VOSpaceType> spaceTypes = new List<VOSpaceType>();
            try
            {
                spaceTypes = spaces.GetSpaceTypes();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return spaceTypes;
        }

        /*This function return all locations available*/
        public List<VOLocation> GetLocations()
        {
            List<VOLocation> locations = new List<VOLocation>();
            try
            {
                locations = spaces.GetLocations();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return locations;
        }

        public void CreateTokens(String mail)
        {
            try
            {
                users.CreateTokens(mail);
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public void RecoverPassword(VORequestPasswordRecovery voPasswordRecovery)
        {
            try
            {
                   users.UpdatePassword(voPasswordRecovery.Mail);                    
             
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        
        public int ValidateEmail(VORequestValidateEmail voValidateEmail)
        {
            try
            {
                return users.ValidateEmail(voValidateEmail.ActivationCode);
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public string UpdateUserAdmin(VORequestUpdateUserAdmin voRequestUpdate)
        {
            try
            {
                String message = util.ValidAccessToken(voRequestUpdate.Mail, voRequestUpdate.AccessToken);
                if (EnumMessages.OK.Equals(message))
                {
                    users.UpdateUserAdmin(voRequestUpdate);
                   
                }
                return message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
    }
}
