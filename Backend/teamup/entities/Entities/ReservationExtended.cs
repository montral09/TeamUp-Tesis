﻿using System;

namespace backend.Logic.Entities
{
    public class ReservationExtended : Reservation
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
        public Payment CustomerPayment { get; set; }
        public Payment CommissionPayment { get; set; }
        public string CustomerName { get; set; }
        public string MailPublisher { get; set; }

        public ReservationExtended() { }

        public ReservationExtended(int idReservation, string title, int idPublication, String mailCustomer, String planSelected, int reservedQuantity, DateTime dateFrom, string dateFromString, DateTime dateTo, string dateToString, string hourFrom, string hourTo,
            int people, string comment, int totalPrice, int state, string stateDescription, bool individualRent, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, bool reviewed, Payment customerPayment, Payment commissionPayment, string customerName, string mailPublisher)  : base (idPublication, mailCustomer, planSelected, reservedQuantity, dateFrom, dateFromString, dateTo, dateToString, hourFrom, hourTo,
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
            DateTo = dateTo;
            DateToString = dateToString;
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
            CustomerPayment = customerPayment;
            CommissionPayment = commissionPayment;
            CustomerName = customerName;
            MailPublisher = mailPublisher;
        }
    }
}