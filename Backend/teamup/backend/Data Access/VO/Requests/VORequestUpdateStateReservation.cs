using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdateStateReservation : VOTokens
    {
        public String Mail { get; set; }
        public int IdReservation { get; set; }
        public String OldState { get; set; }
        public String NewState { get; set; }
        public String CanceledReason { get; set; }
        public DateTime DateTo { get; set; }

        public VORequestUpdateStateReservation(string mail, int idReservation, string oldState, string newState, string canceledReason, DateTime dateTo, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdReservation = idReservation;
            OldState = oldState;
            NewState = newState;
            CanceledReason = canceledReason;
            DateTo = dateTo;
        }
    }
}

