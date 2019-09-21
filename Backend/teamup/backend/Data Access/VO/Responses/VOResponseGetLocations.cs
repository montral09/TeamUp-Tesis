using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetLocations : VOResponse
    {
        public List<VOLocation> voLocations;

        public VOResponseGetLocations() { }
        public VOResponseGetLocations(List<VOLocation> voLocations)
        {
            this.voLocations = voLocations;
        }
    }
}
