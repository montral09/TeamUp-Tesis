using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetSpace : VOResponse
    {
        public VOPublication Publication;

        public VOResponseGetSpace() { }
        public VOResponseGetSpace(VOPublication publication)
        {
            Publication = publication;
        }
    }
}
