using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOPublicationAdmin : VOPublication
    {
        public String NamePublisher { get; set; }
        public String LastNamePublisher { get; set; }
        public String PhonePublisher { get; set; }
     
        public VOPublicationAdmin() { }

        
        public VOPublicationAdmin(int idPublication, Int64 idUser, string mail, int spaceType, DateTime creationDate, string title, string description, string address, VOLocationCordinates location,
            int capacity, string videoURL, int hourPrice, int dailyPrice, int weeklyPrice, int monthlyPrice, string availability, List<int> facilities, List<string> imagesURL, string state, string city, string namePublisher, string lastNamePublisher, string phonePublisher)
            : base (idPublication, idUser, mail, spaceType, creationDate, title, description, address, location,
             capacity, videoURL,  hourPrice, dailyPrice, weeklyPrice, monthlyPrice, availability, facilities, imagesURL, state, city)
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
            State = state;
            City = city;
        }
    }
}
