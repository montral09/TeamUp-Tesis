using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;

namespace backend.Logic.Entities
{
    public class Publication
    {
        public int IdPublication { get; set; }
        public string Mail { get; set; }
        public String NamePublisher { get; set; }
        public String LastNamePublisher { get; set; }
        public String PhonePublisher { get; set; }
        public int SpaceType { get; set; }
        public long IdUser { get; set; }
        public String CreationDate { get; set; }
        public String Title { get; set; }
        public String Description { get; set; }
        public String Address { get; set; }
        public LocationCordinates Location { get; set; }
        public int Capacity { get; set; }
        public string VideoURL { get; set; }
        public int HourPrice { get; set; }
        public int DailyPrice { get; set; }
        public int WeeklyPrice { get; set; }
        public int MonthlyPrice { get; set; }
        public String Availability { get; set; }
        public List<int> Facilities { get; set; }
        public String State { get; set; }
        public List<string> ImagesURL { get; set; }
        public int QuantityRented { get; set; }
        public List<Review> Reviews { get; set; }
        public int Ranking { get; set; }
        public int TotalViews { get; set; }
        public bool IndividualRent { get; set; }
        public int QuestionsWithoutAnswer { get; set; }
        public bool IsMyPublication { get; set; }
        public int IdPlan { get; set; }
        public PreferentialPlan PreferentialPlan { get; set; }
        public String DateTo { get; set; }
        public bool IsRecommended { get; set; }
        public string City { get; set; }
        public int IdParentPublication { get; set; }

        public Publication() { }

        public Publication(int idPublication, long idUser, string mail, string namePublisher, string lastNamePublisher, string phone, int spaceType, string creationDate, string dateTo, string title, string description, string address, LocationCordinates location,
             int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability,
             List<int> facilities, List<string> imagesURL, string state, int quantityRented, List<Review> reviews, int ranking, string city, int totalViews, bool individualRent, int questionsWithoutAnswer,
             bool isMyPublication, int idPlan, PreferentialPlan preferentialPlan, bool isRecommended, int idParentPublication)
        {
            IdPublication = idPublication;
            IdUser = idUser;
            Mail = mail;
            NamePublisher = namePublisher;
            LastNamePublisher = lastNamePublisher;
            PhonePublisher = phone;
            SpaceType = spaceType;
            CreationDate = creationDate;
            DateTo = dateTo;
            Title = title;
            Description = description;
            Address = address;
            Location = location;
            Capacity = capacity;
            VideoURL = videoURL;
            HourPrice = hourPrice;
            DailyPrice = dailyPrice;
            WeeklyPrice = weeklyPrice;
            MonthlyPrice = monthlyPrice;
            Availability = availability;
            Facilities = facilities;
            ImagesURL = imagesURL;
            State = state;
            QuantityRented = quantityRented;
            Reviews = reviews;
            Ranking = ranking;
            City = city;
            TotalViews = totalViews;
            IndividualRent = individualRent;
            QuestionsWithoutAnswer = questionsWithoutAnswer;
            IsMyPublication = isMyPublication;
            IdPlan = idPlan;
            PreferentialPlan = preferentialPlan;
            IsRecommended = isRecommended;
            IdParentPublication = idParentPublication;
        }        
    }
}
