using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdatePublication : VOTokens
    {
        public VOPublication Publication { get; set; }
        public List<string> ImagesURL { get; set; }
        public List<VOImage> Base64Images { get; set; }

        public VORequestUpdatePublication() { }
        public VORequestUpdatePublication(VOPublication publication, List<string> imagesURL, List<VOImage> base64Images, string accessToken)
            : base (accessToken)

        {
            Publication = publication;
            ImagesURL = imagesURL;
            Base64Images = Base64Images;
            AccessToken = accessToken;
        }
    }
}

