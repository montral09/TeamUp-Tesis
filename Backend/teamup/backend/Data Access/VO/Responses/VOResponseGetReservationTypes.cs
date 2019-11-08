using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Responses
{
    public class VOResponseGetReservationTypes : VOResponse
    {
        public List<VOReservationType> reservationTypes;
        public VOResponseGetReservationTypes() { }
        public VOResponseGetReservationTypes(List<VOReservationType> reservationTypes)
        {
            this.reservationTypes = reservationTypes;
        }
    }
}
