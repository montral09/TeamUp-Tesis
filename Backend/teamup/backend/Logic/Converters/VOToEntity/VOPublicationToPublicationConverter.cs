using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOPublicationToPublicationConverter
    {
        public static Publication Convert(VOPublication voPublication)
        {
            Publication publication = new Publication();
            publication.IdPublication = voPublication.IdPublication;
            publication.IdUser = voPublication.IdUser;
            publication.SpaceType = voPublication.SpaceType;
            publication.Title = voPublication.Title;
            publication.Description = voPublication.Description;
            publication.Address = voPublication.Address;
            publication.City = voPublication.City;
            publication.Location = VOLocationToLocationConverter.Convert(voPublication.Location);
            publication.Capacity = voPublication.Capacity;
            publication.VideoURL = voPublication.VideoURL;
            publication.HourPrice = voPublication.HourPrice;
            publication.DailyPrice = voPublication.DailyPrice;
            publication.WeeklyPrice = voPublication.WeeklyPrice;
            publication.MonthlyPrice = voPublication.MonthlyPrice;
            publication.IdPlan = voPublication.IdPlan;
            publication.Availability = voPublication.Availability;
            publication.Facilities = voPublication.Facilities;
            return publication;
        }

    }
}
