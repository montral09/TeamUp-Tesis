using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOReview
    {
        public string Mail { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public string Review { get; set; }
        public int IdReservation { get; set; }

        public VOReview() { }
        public VOReview(string mail, string name, int rating, string review, int idReservation)
        {
            Mail = mail;
            Name = name;
            Rating = rating;
            Review = review;
            IdReservation = idReservation;
        }
    }
}
