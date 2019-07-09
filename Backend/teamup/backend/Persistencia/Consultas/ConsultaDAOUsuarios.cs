using System;

namespace backend.Persistencia.Consultas
{
    public class ConsultaDAOUsuarios
    {
        public String Member()
        {
            String query = "select id from USUARIOS where nombre=@nombre";
            return query;
        }
    }
}
