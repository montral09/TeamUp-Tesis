using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUserDelete : VOTokens
    { 
        public String Mail { get; set; }

        public VORequestUserDelete() { }
        public VORequestUserDelete(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

