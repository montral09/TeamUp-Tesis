using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Requests
{
    public class VORequestGetReservations : VOTokens
    {
        public String Mail { get; set; }

        public VORequestGetReservations(string mail, string accessToken) : base(accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}
