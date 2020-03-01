using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Exceptions
{
    public class GeneralException : ApplicationException
    {
        public String Codigo { get; set; }       
        public GeneralException(String cod)
        {
            Codigo = cod;
        }
    }
}
