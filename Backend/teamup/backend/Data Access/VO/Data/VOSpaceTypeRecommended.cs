using System.Collections.Generic;

namespace backend.Data_Access.VO.Data
{
    public class VOSpaceTypeRecommended
    {
        public int SpaceType { get; set; }
        public List<VORecommended> Publications;

        public VOSpaceTypeRecommended() { }
        public VOSpaceTypeRecommended(int spaceType, List<VORecommended> publications)
        {
            SpaceType = spaceType;
            Publications = publications;
        }
    }
}
