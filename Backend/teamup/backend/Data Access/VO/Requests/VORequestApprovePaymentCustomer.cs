using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestApprovePaymentCustomer : VOTokens
    {
        public int IdReservation { get; set; }
        public string Mail { get; set; }

        public VORequestApprovePaymentCustomer(int idReservation, string mail, string accessToken) : base (accessToken)
        {
            IdReservation = idReservation;
            AccessToken = accessToken;
            Mail = mail;
        }
    }
}

