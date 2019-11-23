using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOReservationExtended : VOReservation
    { 
        public int IdReservation { get; set; }
        public string TitlePublication { get; set; }
        public string StateDescription { get; set; }

        public VOReservationExtended() { }

        public VOReservationExtended(int idReservation, string title, int idPublication, String mailCustomer, String planSelected, int reservedQuantity, DateTime dateFrom, string hourFrom, string hourTo,
            int people, string comment, int totalPrice, int state, string stateDescription)  : base (idPublication, mailCustomer, planSelected, reservedQuantity, dateFrom, hourFrom, hourTo,
             people, comment, totalPrice, state)       
        {
            IdReservation = idReservation;
            TitlePublication = title;
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
            StateDescription = stateDescription;
        }
    }
}
