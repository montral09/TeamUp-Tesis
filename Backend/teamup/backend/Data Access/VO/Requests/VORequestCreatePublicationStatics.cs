using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;

namespace backend.Data_Access.VO
{
    public class VORequestCreatePublicationStatics : VOTokens
    {
        public String Mail { get; set; }
        public int SpaceType { get; set; }
        public List<int> Facilities { get; set; }
        public int IdPublication { get; set; }
        public bool Favourite { get; set; }
        public bool Rented { get; set; }

        public VORequestCreatePublicationStatics(string mail, int spaceType, List<int> facilities, int idPublication, bool favourite, bool rented, string accessToken) : base (accessToken)
        {
            Mail = mail;
            SpaceType = spaceType;
            Facilities = facilities;
            IdPublication = idPublication;
            Favourite = favourite;
            Rented = rented;
        }
    }
}

