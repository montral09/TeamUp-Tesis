using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetFavorites : VOResponse
    {

        public List<VOPublication> Publications { get; set; }

        public VOResponseGetFavorites() { }
        public VOResponseGetFavorites(List<VOPublication> publications)
        {
            Publications = publications;
        }
    }
}
