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
        public DateTime CreationDate { get; set; }
        public String Title { get; set; }
        public String Description { get; set; }
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
        public List<VOImage> Images { get; set; }
        public List<string> ImagesURL { get; set; }

        public VOPublication() { }

        public VOPublication(String mail, int spaceType, String title, String description, VOLocationCordinates location,
            int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability, List<int> facilities, string state, List<VOImage> images)
        {
            Mail = mail;
            SpaceType = spaceType;
            Title = title;
            Description = description;
            Location = location;
            Capacity = capacity;
            VideoURL = videoURL;
            HourPrice = hourPrice;
            DailyPrice = dailyPrice;
            WeeklyPrice = weeklyPrice;
            MonthlyPrice = monthlyPrice;
            Availability = availability;
            Facilities = facilities;
            State = state;
            Images = images;
        }

        public VOPublication(int idPublication, Int64 idUser, string namePublisher, string lastNamePublisher, string mail, string phonePublisher, int spaceType, DateTime creationDate, string title, string description, VOLocationCordinates location,
            int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability, List<int> facilities, List<string> imagesURL)
        {
            IdPublication = idPublication;
            IdUser = idUser;
            NamePublisher = namePublisher;
            LastNamePublisher = lastNamePublisher;
            PhonePublisher = phonePublisher;
            Mail = mail;
            SpaceType = spaceType;
            CreationDate = creationDate;
            Title = title;
            Description = description;
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
        }
    }
}
