using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetReservationsCustomer : VOResponse
    {
        public List<VOReservationExtended> Reservations;

        public VOResponseGetReservationsCustomer() { }

        public VOResponseGetReservationsCustomer(List<VOReservationExtended> reservations)
        {
            Reservations = reservations;
        }
    }
}
