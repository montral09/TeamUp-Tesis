using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class ReviewToVOReviewConverter
    {
        public static VOReview Convert(Review review)
        {
            if (review != null)
            {
                VOReview voReview = new VOReview
                {
                    Mail = review.Mail,
                    Name = review.Name,
                    Rating = review.Rating,
                    Review = review.ReviewDescription,
                    IdReservation = review.IdReservation
                };
                return voReview;
            } else
            {
                return null;
            }
    }

    public static List<VOReview> Convert (List<Review> reviews)
    {
        List<VOReview> voReviews = new List<VOReview>();
        if (reviews != null && reviews.Count != 0)
            {
                foreach (var review in reviews)
                {
                    voReviews.Add(Convert(review));
                }
            }
        return voReviews;
    }
    }
}
