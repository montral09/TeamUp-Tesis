using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOSpaceType
    {
        public int IdSpaceType { get; set; }
        public string Description { get; set; }

        public VOSpaceType() { }
        public VOSpaceType (int idSpaceType, string description)
        {
            this.IdSpaceType = idSpaceType;
            this.Description = description;
        }
    }
}
