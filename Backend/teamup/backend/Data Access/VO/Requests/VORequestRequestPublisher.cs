using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestRequestPublisher
    {
        public String Mail { get; set; }

        public VORequestRequestPublisher(String mail)
        {
            Mail = mail;
        }
    }
}

