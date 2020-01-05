using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOSpaceType
    {
        public int Code { get; set; }
        public string Description { get; set; }
        public bool IndividualRent { get; set; }

        public VOSpaceType() { }
        public VOSpaceType (int code, string description, bool individualRent)
        {
            Code = code;
            Description = description;
            IndividualRent = individualRent;
        }
    }
}
