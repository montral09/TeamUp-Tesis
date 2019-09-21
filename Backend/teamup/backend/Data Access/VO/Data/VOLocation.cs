using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOLocation
    {
        int idLocation { get; set; }
        string description { get; set; }

        public VOLocation() { }
        public VOLocation(int idLocation, string description)
        {
            this.idLocation = idLocation;
            this.description = description;
        }
    }
}
