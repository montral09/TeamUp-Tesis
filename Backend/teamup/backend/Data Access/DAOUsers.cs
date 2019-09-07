using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using backend.Logic;

namespace backend.Data_Access.Query
{
    public class DAOUsers : IDAOUsers
    {
        private QueryDAOUsers cns;
        public DAOUsers()
        {
            cns = new QueryDAOUsers();
        }
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }

        public bool Member(String mail)
        {
            SqlConnection con = null;
            bool member = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.Member();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    member = true;
                }
                dr.Close();
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
            return member;
        }

        public User Find(String mail)
        {
            SqlConnection con = null;
            User user = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.User();
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
                    user = new User(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]), Convert.ToBoolean(dr["active"]));
                }
                dr.Close();
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
            return user;
        }

        public void InsertUser (User user)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.InsertUser();
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()                
                    {
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value = user.Mail},
                        new SqlParameter("@name", SqlDbType.VarChar) {Value = user.Name},
                        new SqlParameter("@lastName", SqlDbType.VarChar) {Value = user.LastName},
                        new SqlParameter("@password", SqlDbType.VarChar) {Value = user.Password},
                        new SqlParameter("@phone", SqlDbType.VarChar) {Value = user.Phone},
                        new SqlParameter("@checkPublisher", SqlDbType.Bit) {Value = user.CheckPublisher},
                        new SqlParameter("@rut", SqlDbType.VarChar) {Value = user.Rut},
                        new SqlParameter("@razonSocial", SqlDbType.VarChar) {Value = user.RazonSocial},
                        new SqlParameter("@address", SqlDbType.VarChar) { Value = user.Address},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.ExecuteNonQuery();
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

        public void UpdateUser(User user)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.UpdateUser();
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value = user.Mail},
                        new SqlParameter("@name", SqlDbType.VarChar) {Value = user.Name},
                        new SqlParameter("@lastName", SqlDbType.VarChar) {Value = user.LastName},
                        new SqlParameter("@password", SqlDbType.VarChar) {Value = user.Password},
                        new SqlParameter("@phone", SqlDbType.VarChar) {Value = user.Phone},
                        new SqlParameter("@rut", SqlDbType.VarChar) {Value = user.Rut},
                        new SqlParameter("@razonSocial", SqlDbType.VarChar) {Value = user.RazonSocial},
                        new SqlParameter("@address", SqlDbType.VarChar) { Value = user.Address},
                    };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
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
        /* Before delete an user, check if its possible by:
         * 1 - Checking active publications
         * 2 - Checking pending payments
         */
        public bool ValidateDeletion(String mail)
        {
            //TODO
            return true;
                
        }

        public void DeleteUser(String mail)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.DeleteUser();
                SqlCommand deleteCommand = new SqlCommand(query, con);
                SqlParameter parametroMail = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                deleteCommand.Parameters.Add(parametroMail);
                deleteCommand.ExecuteNonQuery();
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

        public List<VOPublisher> GetPublishers()
        {
            SqlConnection con = null;
            List<VOPublisher> publishers = new List<VOPublisher>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublishers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {                                                  
                    VOPublisher vo = new VOPublisher(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]),  Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr ["publisherValidated"]), Convert.ToBoolean(dr["mailValidated"]));
                    publishers.Add(vo);
                }
                dr.Close();
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
            return publishers;
        }

        public List<VOCustomer> GetCustomers()
        {
            SqlConnection con = null;
            List<VOCustomer> customers = new List<VOCustomer>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetCustomers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    VOCustomer vo = new VOCustomer(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]));
                    customers.Add(vo);
                }
                dr.Close();
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
            return customers;
        }

        public void ApprovePublishers(List<String> mails)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.ApprovePublishers();                
                for (int i = 0; i < mails.Count; i++)
                {
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    SqlParameter parametroMails = new SqlParameter()
                    {
                        ParameterName = "@publisherMail",
                        Value = mails[i],
                        SqlDbType = SqlDbType.VarChar
                    };

                    updateCommand.Parameters.Add(parametroMails);
                    updateCommand.ExecuteNonQuery();
                }                                             
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

        public bool AdminExists(String mail)
        {
            SqlConnection con = null;
            bool member = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.AdminExists();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    member = true;
                }
                dr.Close();
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
            return member;
        }

        public Admin GetAdmin(String mail, String password)
        {
            SqlConnection con = null;
            Admin admin = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetAdmin();
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
                    admin = new Admin(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]));
                }
                dr.Close();
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
            return admin;
        }
    }
}
