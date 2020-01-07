using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public class Publication
    {
        public int IdPublication { get; set; }
        public int SpaceType { get; set; }
        public int IdUser { get; set; }
        public DateTime CreationDate { get; set; }
        public String Title { get; set; }
        public String Description { get; set; }
        public String Address { get; set; }      
        public Decimal LocationLat { get; set; }
        public Decimal LocationLong { get; set; }
        public int Capacity { get; set; }
        public string VideoURL { get; set; }
        public int HourPrice { get; set; }
        public int DailyPrice { get; set; }
        public int WeeklyPrice { get; set; }
        public int MonthlyPrice { get; set; }
        public String Availability { get; set; }
        public List<int> Facilities { get; set; }
        public string City { get; set; }
        public int TotalViews { get; set; }
        public bool IndividualRent { get; set; }

        public Publication() { }

        public Publication(int idPublication, int spaceType, int idUser, DateTime creationDate, string title, string description, string address, Decimal locationLat, Decimal locationLong, 
            int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability, List<int> facilities, string city, int totalViews, bool individualRent)
        {
            IdPublication = idPublication;
            SpaceType = spaceType;
            IdUser = idUser;
            CreationDate = creationDate;
            Title = title;
            Description = description;
            Address = address;
            LocationLat = locationLat;
            LocationLong = locationLong;
            Capacity = capacity;
            VideoURL = videoURL;
            HourPrice = hourPrice;
            DailyPrice = dailyPrice;
            WeeklyPrice = weeklyPrice;
            MonthlyPrice = monthlyPrice;
            Availability = availability;
            Facilities = facilities;
            City = city;
            TotalViews = totalViews;
            IndividualRent = individualRent;
        }        
    }
}
