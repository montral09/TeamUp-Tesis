using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetPublicationsWithFilters
    {
        public int SpaceType { get; set; }
        public int Capacity { get; set; }
        public List<int> Facilities { get; set; }
        public int PageNumber { get; set; }

        public VORequestGetPublicationsWithFilters() { }

        public VORequestGetPublicationsWithFilters(int spaceType, int capacity, List<int> facilities, int pageNumber)
        {
            SpaceType = spaceType;
            Capacity = capacity;
            Facilities = facilities;
            PageNumber = pageNumber;
        }
    }
}

