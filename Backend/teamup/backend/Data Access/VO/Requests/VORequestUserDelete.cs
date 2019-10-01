using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUserDelete
    { 
        public String Mail { get; set; }

        public VORequestUserDelete() { }
        public VORequestUserDelete(string mail)
        {
            Mail = mail;
        }
    }
}

