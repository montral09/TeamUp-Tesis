using backend.Data_Access.VO.Data;
using System.Collections.Generic;

namespace backend.Data_Access.VO
{
    public class VOResponseGetReservations : VOResponse
    {
        public List<VOReservationExtended> Reservations;

        public VOResponseGetReservations() { }

        public VOResponseGetReservations(List<VOReservationExtended> reservations)
        {
            Reservations = reservations;
        }
    }
}
