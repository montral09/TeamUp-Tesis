using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetPublicationsWithFilters : VOResponse
    {
        public List<VOPublication> Publications;
        public int MaxPage { get; set; }

        public VOResponseGetPublicationsWithFilters() { }

        public VOResponseGetPublicationsWithFilters(List<VOPublication> publications, int maxPage)
        {
            Publications = publications;
            MaxPage = maxPage;
        }
    }
}
