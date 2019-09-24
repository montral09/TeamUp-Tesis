using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestPasswordRecovery
    {
        public String Mail { get; set; }
        public String Name { get; set; } 
        public String AccessToken { get; set; }

        public VORequestPasswordRecovery() { }
        public VORequestPasswordRecovery(string mail, string accessToken, string name)
        {
            Mail = mail;
            Name = name;
            AccessToken = accessToken;
        }
    }
}

