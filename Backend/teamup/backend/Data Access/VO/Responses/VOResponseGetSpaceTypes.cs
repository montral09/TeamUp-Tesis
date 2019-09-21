using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Responses
{
    public class VOResponseGetSpaceTypes : VOResponse
    {
        public List<VOSpaceType> spaceTypes;
        public VOResponseGetSpaceTypes() { }
        public VOResponseGetSpaceTypes(List<VOSpaceType> spaceTypes)
        {
            this.spaceTypes = spaceTypes;
        }
    }
}
