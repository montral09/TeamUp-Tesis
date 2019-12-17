using backend.Data_Access.VO.Data;
using System.Collections.Generic;

namespace backend.Data_Access.VO
{
    public class VOResponseGetRecommendedPublications : VOResponse
    {
        public List<VOSpaceTypeRecommended> Recommended { get; set; }

        public VOResponseGetRecommendedPublications() { }

        public VOResponseGetRecommendedPublications(List<VOSpaceTypeRecommended> recommended)
        {
            Recommended = Recommended;
        }
    }
}
