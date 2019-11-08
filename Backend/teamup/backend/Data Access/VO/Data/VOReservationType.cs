using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOReservationType
    {
        public int Code { get; set; }
        public string Description { get; set; }

        public VOReservationType() { }
        public VOReservationType(int code, string description)
        {
            Code = code;
            Description = description;
        }
    }
}
