using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestPayReservationCustomer : VOTokens
    {
        public String Mail { get; set; }
        public int IdReservation { get; set; }
        public String Comment { get; set; }
        public VOImage Evidence { get; set; }

        public VORequestPayReservationCustomer(string mail, int idReservation, string comment, VOImage evidence, string accessToken) : base(accessToken)
        {
            Mail = mail;
            IdReservation = idReservation;
            Comment = comment;
            Evidence = evidence;
        }        
    }
}

