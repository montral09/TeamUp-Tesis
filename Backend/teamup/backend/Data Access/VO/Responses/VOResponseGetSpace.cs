using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetSpace : VOResponse
    {
        public VOPublication Publication;
        public bool Favorite { get; set; }

        public VOResponseGetSpace() { }
        public VOResponseGetSpace(VOPublication publication, bool favorite)
        {
            Publication = publication;
            Favorite = favorite;
        }
    }
}
