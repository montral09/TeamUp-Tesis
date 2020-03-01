using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestCreateReview : VOTokens
    {
        public VOReview VOReview { get; set; }

        public VORequestCreateReview(VOReview voReview, string accessToken) : base (accessToken)
        {
            VOReview = voReview;
            AccessToken = accessToken;
        }
    }
}

