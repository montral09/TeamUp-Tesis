using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetFavorite : VOTokens
    {
 
        public string Mail { get; set; }

        public VORequestGetFavorite() { }
        public VORequestGetFavorite(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

