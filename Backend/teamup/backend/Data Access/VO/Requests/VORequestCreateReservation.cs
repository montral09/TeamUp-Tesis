using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestCreateReservation : VOTokens
    {
        public VOReservation VOReservation { get; set; }

        public List<VOImage> Images { get; set; }

        public VORequestCreateReservation(VOReservation voReservation, string accessToken) : base (accessToken)
        {
            VOReservation = voReservation;
            AccessToken = accessToken;
        }
    }
}

