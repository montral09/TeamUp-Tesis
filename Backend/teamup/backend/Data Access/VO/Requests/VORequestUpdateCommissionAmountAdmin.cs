using backend.Data_Access.VO.Data;
using System;

namespace backend.Data_Access.VO
{
    public class VORequestUpdateCommissionAmountAdmin : VOTokens
    {
        public String Mail { get; set; }
        public int IdReservation { get; set; }
        public int Price { get; set; }

        public VORequestUpdateCommissionAmountAdmin(string mail, int idReservation, int price, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdReservation = idReservation;
            Price = price;
        }
    }
}

