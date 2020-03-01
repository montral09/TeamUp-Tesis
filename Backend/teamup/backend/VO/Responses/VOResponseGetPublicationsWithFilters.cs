using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetPublicationsWithFilters : VOResponse
    {
        public List<VOPublication> Publications;
        public int TotalPublications { get; set; }

        public VOResponseGetPublicationsWithFilters() { }

        public VOResponseGetPublicationsWithFilters(List<VOPublication> publications, int totalPublications)
        {
            Publications = publications;
            TotalPublications = totalPublications;
        }
    }
}
