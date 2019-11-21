using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOReservation 
    { 
        public int IdPublication { get; set; }
        public string MailCustomer { get; set; }
        public string PlanSelected { get; set; }
        public int ReservedQuantity { get; set; }
        public DateTime DateFrom { get; set; }
        public string HourFrom { get; set; }
        public string HourTo { get; set; }
        public int People { get; set; }
        public string Comment { get; set; }
        public int TotalPrice { get; set; }
        public int State { get; set; }


        public VOReservation() { }

        public VOReservation(int idPublication, String mailCustomer, String planSelected, int reservedQuantity, DateTime dateFrom, string hourFrom, string hourTo,
            int people, string comment, int totalPrice, int state)         
        {
            IdPublication = idPublication;
            MailCustomer = mailCustomer;
            PlanSelected = planSelected;
            ReservedQuantity = reservedQuantity;
            DateFrom = dateFrom;
            HourFrom = hourFrom;
            HourTo = hourTo;
            People = people;
            Comment = comment;
            TotalPrice = totalPrice;
            State = state;
        }
    }
}
