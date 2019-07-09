using backend.Persistencia;
using backend.Persistencia.Consultas;
using System;

namespace backend.Logica
{
    public class Fachada : IFachadaWeb
    {
        private IDAOUsuarios usuarios;

        public Fachada()
        {
            usuarios = new DAOUsuarios();
        }

        public bool existeUsuario(string correo)
        {
            try
            {

                if (usuarios.Member(correo))
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
    }
}
