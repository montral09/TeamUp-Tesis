using System;

namespace backend.Data_Access.VO
{
    public class VORequestLogin
    {
        public String Mail { get; set; }
        public String Password { get; set; }

        public VORequestLogin() { }
        public VORequestLogin(string mail, string password)
        {
            Mail = mail;
            Password = password;
        }
    }
}

