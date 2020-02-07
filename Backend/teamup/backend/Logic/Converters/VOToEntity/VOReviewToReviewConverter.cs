using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOReviewToReviewConverter
    {
        public static Review Convert(VOReview voReview)
        {
            Review review = new Review
            {
                Mail = voReview.Mail,
                Name = voReview.Name,
                Rating = voReview.Rating,
                ReviewDescription = voReview.Review,
                IdReservation = voReview.IdReservation
            };
            return review;
    }
    }
}
