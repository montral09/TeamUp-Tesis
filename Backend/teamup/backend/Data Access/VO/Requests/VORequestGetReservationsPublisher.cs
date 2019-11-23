using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Requests
{
    public class VORequestGetReservationsPublisher : VOTokens
    {
        public String Mail { get; set; }

        public VORequestGetReservationsPublisher(string mail, string accessToken) : base(accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}
