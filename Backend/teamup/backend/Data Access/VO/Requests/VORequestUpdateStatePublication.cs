using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdateStatePublication : VOTokens
    {
        public String Mail { get; set; }
        public int IdPublication { get; set; }
        public String OldState { get; set; }
        public String NewState { get; set; }
        public String RejectedReason { get; set; }

        public VORequestUpdateStatePublication(string mail, int idPublication, string oldState, string newState, string rejectedReason, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdPublication = idPublication;
            OldState = oldState;
            NewState = newState;
            RejectedReason = rejectedReason;
        }
    }
}

