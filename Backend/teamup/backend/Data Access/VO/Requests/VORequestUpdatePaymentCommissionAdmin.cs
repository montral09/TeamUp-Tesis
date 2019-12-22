using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdatePaymentCommissionAdmin : VOTokens
    {
        public String Mail { get; set; }
        public int IdReservation { get; set; }
        public bool Approved { get; set; }
        public String RejectedReason { get; set; }

        public VORequestUpdatePaymentCommissionAdmin(string mail, int idReservation, bool approved, string rejectedReason, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdReservation = idReservation;
            Approved = approved;
            RejectedReason = rejectedReason;
        }
    }
}

