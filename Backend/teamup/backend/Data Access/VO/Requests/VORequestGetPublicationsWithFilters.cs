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
        public string City { get; set; }
        public int PageNumber { get; set; }
        public string State { get; set; }
 
        public VORequestGetPublicationsWithFilters() { }

        public VORequestGetPublicationsWithFilters(int spaceType, int capacity, List<int> facilities, string city, int pageNumber, string state)
        {
            SpaceType = spaceType;
            Capacity = capacity;
            Facilities = facilities;
            PageNumber = pageNumber;
            State = state;
            City = city;
        }
    }
}

