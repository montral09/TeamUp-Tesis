using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class PublicationToVOPublicationConverter
    {
        public static VOPublication Convert(Publication publication)
        {
            VOPublication voPublication = new VOPublication();
            voPublication.IdPublication = publication.IdPublication;
            voPublication.IdUser = publication.IdUser;
            voPublication.Mail = publication.Mail;
            voPublication.NamePublisher = publication.NamePublisher;
            voPublication.LastNamePublisher = publication.LastNamePublisher;
            voPublication.PhonePublisher = publication.PhonePublisher;
            voPublication.SpaceType = publication.SpaceType;
            voPublication.CreationDate = publication.CreationDate;
            voPublication.Title = publication.Title;
            voPublication.Description = publication.Description;
            voPublication.Address = publication.Address;
            voPublication.City = publication.City;
            voPublication.Location = LocationToVOLocationConverter.Convert(publication.Location);
            voPublication.Capacity = publication.Capacity;
            voPublication.VideoURL = publication.VideoURL;
            voPublication.HourPrice = publication.HourPrice;
            voPublication.DailyPrice = publication.DailyPrice;
            voPublication.WeeklyPrice = publication.WeeklyPrice;
            voPublication.MonthlyPrice = publication.MonthlyPrice;
            voPublication.IdPlan = publication.IdPlan;
            voPublication.Availability = publication.Availability;
            voPublication.Facilities = publication.Facilities;
            voPublication.State = publication.State;
            voPublication.ImagesURL = publication.ImagesURL;
            voPublication.QuantityRented = publication.QuantityRented;
            voPublication.Reviews = ReviewToVOReviewConverter.Convert(publication.Reviews);
            voPublication.Ranking = publication.Ranking;
            voPublication.TotalViews = publication.TotalViews;
            voPublication.IndividualRent = publication.IndividualRent;
            voPublication.QuestionsWithoutAnswer = publication.QuestionsWithoutAnswer;
            voPublication.IsMyPublication = publication.IsMyPublication;
            voPublication.IdPlan = publication.IdPlan;
            if (publication.PreferentialPlan != null)
            {
                voPublication.PreferentialPlan = PreferentialPlanToVOPreferentialPlanConverter.Convert(publication.PreferentialPlan);
            }            
            voPublication.DateTo = publication.DateTo;
            voPublication.IsRecommended = publication.IsRecommended;
            voPublication.IsChildPublication = publication.IsChildPublication;
            return voPublication;
        }

        public static List<VOPublication> Convert(List<Publication> publications)
        {
            List<VOPublication> voPublications = new List<VOPublication>();
            if (publications != null && publications.Count != 0)
            {
                foreach (var pub in publications)
                {
                    voPublications.Add(Convert(pub));
                }
            }
            return voPublications;
        }
    }
}
