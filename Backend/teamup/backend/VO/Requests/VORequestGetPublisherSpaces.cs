using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetPublisherSpaces : VOTokens
    {
 
        public string Mail { get; set; }

        public VORequestGetPublisherSpaces() { }
        public VORequestGetPublisherSpaces(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

