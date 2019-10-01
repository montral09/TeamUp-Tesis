using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestAdminLogin
    {
        public String Mail { get; set; }
        public String Password { get; set; }

        public VORequestAdminLogin() { }
        public VORequestAdminLogin(string mail, string password)
        {
            Mail = mail;
            Password = password;
        }
    }
}

