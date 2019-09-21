using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOSpaceType
    {
        int idSpaceType { get; set; }
        string description { get; set; }

        public VOSpaceType() { }
        public VOSpaceType (int idSpaceType, string description)
        {
            this.idSpaceType = idSpaceType;
            this.description = description;
        }
    }
}
