using backend.Data_Access.Query;
using backend.Data_Access.VO;
using System;

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
                    result = new VOUserLogin(usr.IdUser, usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.UserType);
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
