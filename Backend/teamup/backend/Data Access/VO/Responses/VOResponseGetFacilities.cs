using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Responses
{
    public class VOResponseGetFacilities : VOResponse
    {
        public List<VOFacility> facilities;
        public VOResponseGetFacilities() { }
        public VOResponseGetFacilities(List<VOFacility> facilities)
        {
            this.facilities = facilities;
        }
    }
}
