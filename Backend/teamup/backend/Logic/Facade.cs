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

        public Facade()
        {
            users = new DAOUsers();
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
        /* This function will return the user or null if user/password doesn't match  */
        public VOUser ValidUserLogin(string mail, string password)
        {
            VOUser result = null;
            try
            {
                User usr = users.Find(mail);
                // TO DO : Validate password better
                if (usr != null && usr.Password.Equals(password))
                {
                    result = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Rut, usr.RazonSocial, usr.Address);                    
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
                users.UpdateUser(u);

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
    }
}
