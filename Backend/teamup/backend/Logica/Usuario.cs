using System;

namespace backend.Logica
{
    public class Usuario
    {
        private int idUsuario;

        public String Nombre { get; set; }
        public String Apellido { get; set; }
        public String Contrasena { get; set; }
        public String Correo { get; set; }

        public Usuario(String Nom, String Ape, String Cont, String Corr)
        {
            Nombre = Nom;
            Apellido = Ape;
            Contrasena = Cont;
            Correo = Corr;
        }
    }
}
