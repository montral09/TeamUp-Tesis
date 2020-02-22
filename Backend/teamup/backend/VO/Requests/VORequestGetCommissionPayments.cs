using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetCommissionPayments : VOTokens
    {
 
        public string Mail { get; set; }

        public VORequestGetCommissionPayments() { }
        public VORequestGetCommissionPayments(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

