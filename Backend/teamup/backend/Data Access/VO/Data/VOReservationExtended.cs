﻿using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOReservationExtended : VOReservation
    { 
        public int IdReservation { get; set; }
        public string TitlePublication { get; set; }
        public string StateDescription { get; set; }
        public bool IndividualRent { get; set; }
        public int HourPrice { get; set; }
        public int DailyPrice { get; set; }
        public int WeeklyPrice { get; set; }
        public int MonthlyPrice { get; set; }
        public bool Reviewed { get; set; }
        public int CustomerPaymentState { get; set; }
        public string CustomerPaymentDescription { get; set; }

        public VOReservationExtended() { }

        public VOReservationExtended(int idReservation, string title, int idPublication, String mailCustomer, String planSelected, int reservedQuantity, DateTime dateFrom, string dateFromString, string hourFrom, string hourTo,
            int people, string comment, int totalPrice, int state, string stateDescription, bool individualRent, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, bool reviewed, int customerPaymentState, string customerPaymentDescription)  : base (idPublication, mailCustomer, planSelected, reservedQuantity, dateFrom, dateFromString, hourFrom, hourTo,
             people, comment, totalPrice, state)       
        {
            IdReservation = idReservation;
            TitlePublication = title;
            IdPublication = idPublication;
            MailCustomer = mailCustomer;
            PlanSelected = planSelected;
            ReservedQuantity = reservedQuantity;
            DateFrom = dateFrom;
            DateFromString = dateFromString;
            HourFrom = hourFrom;
            HourTo = hourTo;
            People = people;
            Comment = comment;
            TotalPrice = totalPrice;
            State = state;
            StateDescription = stateDescription;
            IndividualRent = individualRent;
            HourPrice = hourPrice;
            DailyPrice = dailyPrice;
            WeeklyPrice = weeklyPrice;
            MonthlyPrice = monthlyPrice;
            Reviewed = reviewed;
            CustomerPaymentState = customerPaymentState;
            CustomerPaymentDescription = customerPaymentDescription;
        }
    }
}
