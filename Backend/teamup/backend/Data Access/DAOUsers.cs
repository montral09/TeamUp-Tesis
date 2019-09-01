using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using backend.Data_Access.VO;
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
        private String ObtenerConnectionString()
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
                con = new SqlConnection(ObtenerConnectionString());
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
            catch (Exception e)
            {
                throw e;//("Error al verificar si existe el usuario");
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
                con = new SqlConnection(ObtenerConnectionString());
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
                    user = new User(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publishValidated"]), Convert.ToBoolean(dr["active"]));
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw e;// new Excepcion("Error al verificar si existe el usuario");
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
                con = new SqlConnection(ObtenerConnectionString());
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
            catch (Exception e)
            {
                throw e;
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
                con = new SqlConnection(ObtenerConnectionString());
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
            catch (Exception e)
            {
                throw e;
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
                con = new SqlConnection(ObtenerConnectionString());
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
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<VOUser> GetPublishers()
        {
            SqlConnection con = null;
            List<VOUser> publishers = new List<VOUser>();
            try
            {
                con = new SqlConnection(ObtenerConnectionString());
                con.Open();
                String query = cns.GetPublishers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    VOUser vo = new VOUser(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]));
                    publishers.Add(vo);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw e;
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

        public List<VOUser> GetCustomers()
        {
            SqlConnection con = null;
            List<VOUser> customers = new List<VOUser>();
            try
            {
                con = new SqlConnection(ObtenerConnectionString());
                con.Open();
                String query = cns.GetCustomers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    VOUser vo = new VOUser(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]));
                    customers.Add(vo);
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw e;
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

        public void ApprovePublishers(List<VOUser> publishers)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(ObtenerConnectionString());
                con.Open();
                String query = cns.ApprovePublishers();                
                for (int i = 0; i < publishers.Count; i++)
                {
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    SqlParameter parametroMails = new SqlParameter()
                    {
                        ParameterName = "@publisherMail",
                        Value = publishers[i].Mail,
                        SqlDbType = SqlDbType.VarChar
                    };

                    updateCommand.Parameters.Add(parametroMails);
                    updateCommand.ExecuteNonQuery();
                }                                             
            }
            catch (Exception e)
            {
                throw e;
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
                con = new SqlConnection(ObtenerConnectionString());
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
            catch (Exception e)
            {
                throw e;//("Error al verificar si existe el admin");
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

        public User GetAdmin(String mail, String password)
        {
            SqlConnection con = null;
            User user = null;
            try
            {
                con = new SqlConnection(ObtenerConnectionString());
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
                    user = new User(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["active"]));
                }
                dr.Close();
            }
            catch (Exception e)
            {
                throw e;// new Excepcion("Error al verificar si existe el usuario");
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
    }
}
