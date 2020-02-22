using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponse
    {
       public String responseCode { get; set; }

       public VOResponse() { }

        public VOResponse(String responseCode)
        {
            this.responseCode = responseCode;
        }

    }
}
