using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestCreatePublication : VOTokens
    {
        public VOPublication VOPublication { get; set; }

        public List<VOImage> Images { get; set; }

        public VORequestCreatePublication(VOPublication voPublication, string accessToken, List<VOImage> images) : base (accessToken)
        {
            VOPublication = voPublication;
            AccessToken = accessToken;
            Images = images;
        }
    }
}

