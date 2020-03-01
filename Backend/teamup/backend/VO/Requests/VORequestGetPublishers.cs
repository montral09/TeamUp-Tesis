using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetPublishers : VOTokens
    {
 
        public string Mail { get; set; }

        public VORequestGetPublishers() { }
        public VORequestGetPublishers(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

