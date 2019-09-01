using backend.Data_Access.Query;
using backend.Data_Access.VO;
using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public class Fachada : IFachadaWeb
    {
        private IDAOUsers users;

        public Fachada()
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
            catch (Exception e)
            {
                throw e;
            }
        }
        /* This function will return the user or null if user/password doesn't match  */
        public VOUserLogin ValidUserLogin(string mail, string password)
        {
            VOUserLogin result = null;
            try
            {
                User usr = users.Find(mail);
                // TO DO : Validate password better
                if (usr.Password.Equals(password))
                {
                    result = new VOUserLogin(usr.IdUser, usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.CheckPublisher);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            return result;
        }

        /* This function creates a new user (publisher, or customer)  */
        public void CreateUser(VOUser voUser)
        {
            try
            {
                User u = new User(voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false, false, true);
                users.InsertUser(u);

            }
            catch (Exception e)
            {
                throw e;
            }
        }
        /* This function updates data from an specific user  */
        public void UpdateUser(VOUser voUser)
        {
            try
            {
                User u = new User(voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false, false, true);
                users.UpdateUser(u);

            }
            catch (Exception e)
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
            catch (Exception e)
            {
                throw e;
            }
        }

        /* This function obtains all Publishers  */
        public List<VOUser> GetPublishers()
        {
            List<VOUser> publishers = new List<VOUser>();
            try
            {
                publishers = users.GetPublishers();
            }
            catch (Exception e)
            {
                throw e;
            }
            return publishers;
        }
        /* This function obtains all Customers  */
        public List<VOUser> GetCustomers()
        {
            List<VOUser> customers = new List<VOUser>();
            try
            {
                customers = users.GetCustomers();
            }
            catch (Exception e)
            {
                throw e;
            }
            return customers;
        }
        /* This function recieve a list of Publishers to be approved  */
        public void ApprovePublishers(List<VOUser> publishers)
        {            
            try
            {
                users.ApprovePublishers(publishers);
            }
            catch (Exception e)
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
            catch (Exception e)
            {
                throw e;
            }
        }

        /* This function returns admin user  */
        public VOUser GetAdmin(string mail, string password)
        {
            VOUser result = null;
            try
            {
                User usr = users.GetAdmin(mail, password);
                if (usr.Password.Equals(password))
                {
                    result = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Address);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            return result;
        }
    }
}
