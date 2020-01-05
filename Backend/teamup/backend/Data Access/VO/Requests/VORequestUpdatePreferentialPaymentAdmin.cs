using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdatePreferentialPaymentAdmin : VOTokens
    {
        public String Mail { get; set; }
        public int IdPublication { get; set; }
        public bool Approved { get; set; }
        public String RejectedReason { get; set; }

        public VORequestUpdatePreferentialPaymentAdmin(string mail, int idPublication, bool approved, string rejectedReason, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdPublication = idPublication;
            Approved = approved;
            RejectedReason = rejectedReason;
        }
    }
}

