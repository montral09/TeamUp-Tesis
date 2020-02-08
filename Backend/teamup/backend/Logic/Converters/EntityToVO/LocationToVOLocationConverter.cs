using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.EntityToVO
{
    public static class LocationToVOLocationConverter
    {
        public static VOLocationCordinates Convert(LocationCordinates location)
        {
            if (location != null)
            {
                VOLocationCordinates voLocation = new VOLocationCordinates
                {
                    Latitude = location.Latitude,
                    Longitude = location.Longitude
                };
                return voLocation;
            } else
            {
                return null;
            }
            
        }
    }
}
