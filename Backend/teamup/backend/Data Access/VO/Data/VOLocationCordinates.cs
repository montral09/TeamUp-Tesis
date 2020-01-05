using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOLocationCordinates
    {
        public Decimal Latitude { get; set; }
        public Decimal Longitude { get; set; }

        public VOLocationCordinates() { }

        public VOLocationCordinates(Decimal latitude, Decimal longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}
