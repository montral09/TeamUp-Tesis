using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetReservationTypes : VOTokens
    {
        public string Mail { get; set; }
        public VORequestGetReservationTypes() { }
        public VORequestGetReservationTypes(string mail, string accessToken) : base (accessToken)
        {
            AccessToken = accessToken;
            Mail = mail; 
        }
    }
}

