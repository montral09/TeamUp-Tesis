
namespace backend.Logic.Entities
{
    public class Review
    {
        public string Mail { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public string ReviewDescription { get; set; }
        public int IdReservation { get; set; }

        public Review() { }

        public Review(string mail, string name, int rating, string review, int idReservation)
        {
            Mail = mail;
            Name = name;
            Rating = rating;
            ReviewDescription = review;
            IdReservation = idReservation;
        }
    }
}
