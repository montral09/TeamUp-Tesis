using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
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
                    string userType = Convert.ToString(dr["userType"]);
                    if (userType.Equals("GEST")) // TO DO : Move this to table or enum
                    {
                        // TO DO : Create gestor 
                    }
                    else
                    {
                        user = new User(Convert.ToInt32(dr["idUser"]), Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["userType"]));
                    }
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
