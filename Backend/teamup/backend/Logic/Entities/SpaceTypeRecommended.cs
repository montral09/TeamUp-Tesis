using System.Collections.Generic;

namespace backend.Logic.Entities
{
    public class SpaceTypeRecommended
    {
        public int SpaceType { get; set; }
        public List<Recommended> Publications;

        public SpaceTypeRecommended() { }
        public SpaceTypeRecommended(int spaceType, List<Recommended> publications)
        {
            SpaceType = spaceType;
            Publications = publications;
        }
    }
}
