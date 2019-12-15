using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOPublication
    {
        public int IdPublication { get; set; }
        public Int64 IdUser { get; set; }
        public String Mail { get; set; }
        public String NamePublisher { get; set; }
        public String LastNamePublisher { get; set; }
        public String PhonePublisher { get; set; }
        public int SpaceType { get; set; }
        public String CreationDate { get; set; }
        public String Title { get; set; }
        public String Description { get; set; }
        public String Address { get; set; }
        public String City { get; set; }
        public VOLocationCordinates Location { get; set; }
        public int Capacity { get; set; }
        public String VideoURL { get; set; }
        public int HourPrice { get; set; }
        public int DailyPrice { get; set; }
        public int WeeklyPrice { get; set; }
        public int MonthlyPrice { get; set; }
        public String Availability { get; set; }
        public List<int> Facilities { get; set; }
        public String State { get; set; }
        public List<string> ImagesURL { get; set; }
        public int QuantityRented { get; set; }
        public List<VOReview> Reviews { get; set; }
        public int Ranking { get; set; }
        public int TotalViews { get; set; }
        public bool IndividualRent { get; set; }
        public int QuestionsWithoutAnswer { get; set; }
        public bool IsMyPublication { get; set; }
        public int IdPlan { get; set; }
        public VOPreferentialPlan PreferentialPlan { get;set;}

        public VOPublication() { }

        public VOPublication(int idPublication, int spaceType, String title, String city, String address,
            int capacity, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, int ranking)
        {
            IdPublication = idPublication;
            SpaceType = spaceType;
            Title = title;
            City = city;
            Address = address;
            Capacity = capacity;           
            HourPrice = hourPrice;
            DailyPrice = dailyPrice;
            WeeklyPrice = weeklyPrice;
            MonthlyPrice = monthlyPrice;
            Ranking = ranking;
        }

        public VOPublication(int idPublication, Int64 idUser, string mail, int spaceType, string creationDate, string title, string description, string address, VOLocationCordinates location,
            int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability, List<int> facilities, List<string> imagesURL, string state, string city)
        {
            IdPublication = idPublication;
            IdUser = idUser;
            Mail = mail;
            SpaceType = spaceType;
            CreationDate = creationDate;
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
            City = city;
        }

        public VOPublication(int idPublication, string mail, string namePublisher, string lastNamePublisher, string phone, int spaceType, string creationDate, string title, string description, string address, string city, VOLocationCordinates location,
             int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability,
             List<int> facilities, List<string> imagesURL, string state, int quantityRented, List<VOReview> reviews, int ranking, int totalViews, bool individualRent, int questionsWithoutAnswer,
             bool isMyPublication, int idPlan, VOPreferentialPlan preferentialPlan)
        {
            IdPublication = idPublication;
            Mail = mail;
            NamePublisher = namePublisher;
            LastNamePublisher = lastNamePublisher;
            PhonePublisher = phone;
            SpaceType = spaceType;
            CreationDate = creationDate;
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
        }
    }
}
