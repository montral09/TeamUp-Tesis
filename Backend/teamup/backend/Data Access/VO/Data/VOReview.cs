using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOReview
    {
        public int IdUser { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public string Review { get; set; }

        public VOReview() { }
        public VOReview(int idUser, string name, int rating, string review)
        {
            IdUser = idUser;
            Name = name;
            Rating = rating;
            Review = review;
        }
    }
}
