using System;

namespace backend.Logic.Entities
{
    public class Image
    {
        public string Base64String { get; set; }
        public string Extension { get; set; }

        public Image() { }

        public Image(string base64String, String extension)
        {
            Base64String = base64String;
            Extension = extension;            
        }
    }
}
