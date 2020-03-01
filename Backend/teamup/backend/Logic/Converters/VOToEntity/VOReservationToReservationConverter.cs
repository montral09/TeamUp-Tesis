using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOReservationToReservationConverter
    {
        public static Reservation Convert(VOReservation voReservation)
        {
            Reservation reservation = new Reservation
            {
                IdPublication = voReservation.IdPublication,
                MailCustomer = voReservation.MailCustomer,
                PlanSelected = voReservation.PlanSelected,
                ReservedQuantity = voReservation.ReservedQuantity,
                DateFrom = voReservation.DateFrom,
                DateFromString = voReservation.DateFromString,
                DateTo = voReservation.DateTo,
                DateToString = voReservation.DateToString,
                HourFrom = voReservation.HourFrom,
                HourTo = voReservation.HourTo,
                People = voReservation.People,
                Comment = voReservation.Comment,
                TotalPrice = voReservation.TotalPrice,
                State = voReservation.State
            };
            return reservation;
    }

}
}
