using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class STypeRecommendedToVOSTypeRecommendedConverter
    {
        public static VOSpaceTypeRecommended Convert(SpaceTypeRecommended spaceTypeRecommended)
        {
            VOSpaceTypeRecommended voSpaceTypeRecommended = new VOSpaceTypeRecommended
            {
                SpaceType = spaceTypeRecommended.SpaceType,
                Publications = ConvertRecommendedList(spaceTypeRecommended.Publications),
        };
            return voSpaceTypeRecommended;
        }
    
        private static VORecommended ConvertRecommended(Recommended recommended)
        {
            VORecommended vORecommended = new VORecommended
            {
                IdPublication = recommended.IdPublication,
                Title = recommended.Title,
                Address = recommended.Address,
                City = recommended.City,
                Capacity = recommended.Capacity,
                ImagesURL = recommended.ImagesURL
            };
            return vORecommended;
        }

        private static List<VORecommended> ConvertRecommendedList(List<Recommended> recommended)
        {
            List<VORecommended> voRecommended = new List<VORecommended>();
            foreach (var rec in recommended)
            {
                voRecommended.Add(ConvertRecommended(rec));
            }
            return voRecommended;
        }

        public static List<VOSpaceTypeRecommended> Convert (List<SpaceTypeRecommended> recommended)
        {
            List<VOSpaceTypeRecommended> voRecommended = new List<VOSpaceTypeRecommended>();
            if (recommended != null && recommended.Count != 0)
            {
                foreach (var rec in recommended)
                {
                    voRecommended.Add(Convert(rec));
                }
            }
            return voRecommended;
        }
    }
}
