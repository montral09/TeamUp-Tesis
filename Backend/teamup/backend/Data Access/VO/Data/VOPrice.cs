using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOPrice
    {
        public int ReservationTypeCode { get; set; }
        public int Price { get; set; }

        public VOPrice() { }

        public VOPrice(int reservationTypeCode, int price)
        {
            ReservationTypeCode = reservationTypeCode;
            Price = price;
        }
    }
}
