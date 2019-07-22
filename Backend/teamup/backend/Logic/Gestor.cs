using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Logic
{
    public class Gestor : User
    {
        public String Rut { get; set; }
        public String RazonSocial { get; set; }

        public Gestor() { }
        public Gestor(string rut, string razonSocial)
        {
            Rut = rut;
            RazonSocial = razonSocial;
        }
    }
}
