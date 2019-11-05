using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdatePublication : VOTokens
    {
        public VOPublication Publication { get; set; }
        public List<VOImage> Images { get; set; }

        public VORequestUpdatePublication() { }
        public VORequestUpdatePublication(VOPublication publication, List<VOImage> images, string accessToken)
            : base (accessToken)

        {
            Publication = publication;
            Images = images;
            AccessToken = accessToken;
        }
    }
}

