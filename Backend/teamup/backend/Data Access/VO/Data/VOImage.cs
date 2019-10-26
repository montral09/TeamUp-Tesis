using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOImage
    {
        public string Base64String { get; set; }
        public string Extension { get; set; }

        public VOImage() { }

        public VOImage(string base64String, String extension)
        {
            Base64String = base64String;
            Extension = extension;            
        }
    }
}
