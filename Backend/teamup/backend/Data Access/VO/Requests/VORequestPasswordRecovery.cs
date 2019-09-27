using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestPasswordRecovery
    {
        public String Mail { get; set; }        

        public VORequestPasswordRecovery() { }
        public VORequestPasswordRecovery(string mail)
        {
            Mail = mail;
        }
    }
}

