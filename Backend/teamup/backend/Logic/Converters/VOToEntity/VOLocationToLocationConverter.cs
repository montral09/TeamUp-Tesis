using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOLocationToLocationConverter
    {
        public static LocationCordinates Convert(VOLocationCordinates voLocation)
        {
            LocationCordinates location = new LocationCordinates();
            location.Latitude = voLocation.Latitude;
            location.Longitude = voLocation.Longitude;
            return location;
        }
    }
}
