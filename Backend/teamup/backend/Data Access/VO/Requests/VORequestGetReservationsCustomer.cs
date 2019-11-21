using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Requests
{
    public class VORequestGetReservationsCustomer : VOTokens
    {
        public String Mail { get; set; }

        public VORequestGetReservationsCustomer(string mail, string accessToken) : base(accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}
