using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace backend.Persistencia.Consultas
{
    public class DAOUsuarios : IDAOUsuarios
    {
        private ConsultaDAOUsuarios cns;
        public DAOUsuarios()
        {
            cns = new ConsultaDAOUsuarios();
        }
        private String ObtenerConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }

        public bool Member(String usuario)
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
                    ParameterName = "@nombre",
                    Value = usuario,
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
    }
}
