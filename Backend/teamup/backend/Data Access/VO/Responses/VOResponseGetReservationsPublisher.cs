using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetReservationsPublisher : VOResponse
    {
        public List<VOReservationExtended> Reservations;

        public VOResponseGetReservationsPublisher() { }

        public VOResponseGetReservationsPublisher(List<VOReservationExtended> reservations)
        {
            Reservations = reservations;
        }
    }
}
