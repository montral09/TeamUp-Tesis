using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class FacilityToVOFacilityConverter
    {
        public static VOFacility Convert(Facility facility)
        {
            VOFacility voFacility = new VOFacility
            {
                Code = facility.Code,
                Description = facility.Description,
                Icon = facility.Icon
            };
            return voFacility;
        }

        public static List<VOFacility> Convert (List<Facility> facilities)
        {
            List<VOFacility> voFacilities = new List<VOFacility>();
            if (facilities != null && facilities.Count != 0)
            {
                foreach (var facility in facilities)
                {
                    voFacilities.Add(Convert(facility));
                }
            }
            return voFacilities;
        }
    }
}
