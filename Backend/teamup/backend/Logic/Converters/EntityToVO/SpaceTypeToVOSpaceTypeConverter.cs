using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class SpaceTypeToVOSpaceTypeConverter
    {
        public static VOSpaceType Convert(SpaceType spaceType)
        {
            VOSpaceType voSpaceType = new VOSpaceType
            {
                Code = spaceType.Code,
                Description = spaceType.Description,
                IndividualRent = spaceType.IndividualRent
            };
            return voSpaceType;
        }

        public static List<VOSpaceType> Convert (List<SpaceType> spaceTypes)
        {
            List<VOSpaceType> voSpaceTypes = new List<VOSpaceType>();
            if (spaceTypes != null && spaceTypes.Count != 0)
            {
                foreach (var spaceType in spaceTypes)
                {
                    voSpaceTypes.Add(Convert(spaceType));
                }
            }
            return voSpaceTypes;
        }
    }
}
