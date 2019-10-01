using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOLocation
    {
        public int IdLocation { get; set; }
        public string Description { get; set; }

        public VOLocation() { }
        public VOLocation(int idLocation, string description)
        {
            this.IdLocation = idLocation;
            this.Description = description;
        }
    }
}
