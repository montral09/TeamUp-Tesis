using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestValidateEmail
    {
        public String ActivationCode { get; set; }

        public VORequestValidateEmail(String activationCode)
        {
            ActivationCode = activationCode;
        }
    }
}

