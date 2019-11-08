using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetPublisherSpaces : VOResponse
    {

        public List<VOPublication> Publications { get; set; }

        public VOResponseGetPublisherSpaces() { }
        public VOResponseGetPublisherSpaces(List<VOPublication> publications)
        {
            Publications = publications;
        }
    }
}
