using System;

namespace backend.Logic.Entities
{
    public class LocationCordinates
    {
        public Decimal Latitude { get; set; }
        public Decimal Longitude { get; set; }

        public LocationCordinates() { }

        public LocationCordinates(Decimal latitude, Decimal longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}
