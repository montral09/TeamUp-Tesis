using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOFacility
    {
        public int Code { get; set; }
        public string Description { get; set; }

        public VOFacility() { }
        public VOFacility(int code, string description)
        {
            Code = code;
            Description = description;
        }
    }
}
