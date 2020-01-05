using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdateReservation : VOTokens
    {
        public int IdReservation{ get; set; }
        public string Mail { get; set; }
        public DateTime DateFrom { get; set; }
        public string HourFrom { get; set; }
        public string HourTo { get; set; }
        public int TotalPrice { get; set; }
        public int People { get; set; }

        public VORequestUpdateReservation() { }
        public VORequestUpdateReservation(int idReservation, string mail, DateTime dateFrom, string hourFrom, string hourTo, int totalPrice, int people, string accessToken)
            : base (accessToken)

        {
            IdReservation = idReservation;
            Mail = mail;
            DateFrom = dateFrom;
            HourFrom = hourFrom;
            HourTo = hourTo;
            TotalPrice = totalPrice;
            People = people;
        }
    }
}

