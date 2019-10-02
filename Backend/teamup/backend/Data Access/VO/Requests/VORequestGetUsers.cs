using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetUsers : VOTokens
    {
 
        public string Mail { get; set; }

        public VORequestGetUsers() { }
        public VORequestGetUsers(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

