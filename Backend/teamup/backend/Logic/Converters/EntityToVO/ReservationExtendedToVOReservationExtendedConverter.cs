using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class ReservationExtendedToVOReservationExtendedConverter
    {
        public static VOReservationExtended Convert(ReservationExtended reservation)
        {
            VOReservationExtended voReservation = new VOReservationExtended
            {
                IdReservation = reservation.IdReservation,
                TitlePublication = reservation.TitlePublication,
                IdPublication = reservation.IdPublication,
                MailCustomer = reservation.MailCustomer,
                PlanSelected = reservation.PlanSelected,
                ReservedQuantity = reservation.ReservedQuantity,
                DateFrom = reservation.DateFrom,
                DateFromString = reservation.DateFromString,
                DateTo = reservation.DateTo,
                DateToString = reservation.DateToString,
                HourFrom = reservation.HourFrom,
                HourTo = reservation.HourTo,
                People = reservation.People,
                Comment = reservation.Comment,
                TotalPrice = reservation.TotalPrice,
                State = reservation.State,
                StateDescription = reservation.StateDescription,
                IndividualRent = reservation.IndividualRent,
                HourPrice = reservation.HourPrice,
                DailyPrice = reservation.DailyPrice,
                WeeklyPrice = reservation.WeeklyPrice,
                MonthlyPrice = reservation.MonthlyPrice,
                Reviewed = reservation.Reviewed,
                CustomerPayment = PaymentToVOPaymentConverter.Convert(reservation.CustomerPayment),
                CommissionPayment = PaymentToVOPaymentConverter.Convert(reservation.CommissionPayment),
                CustomerName = reservation.CustomerName,
                MailPublisher = reservation.MailPublisher,
        };
            return voReservation;
        }

        public static List<VOReservationExtended> Convert(List<ReservationExtended> reservations)
        {            
            List<VOReservationExtended> voReservations = new List<VOReservationExtended>();
            foreach (var reservation in reservations)
            {
                voReservations.Add(Convert(reservation));
            }
            return voReservations;
        }
    }
}
