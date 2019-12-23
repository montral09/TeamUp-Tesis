using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VORecommended
    {
        public int IdPublication { get; set; }        
        public String Title { get; set; }        
        public String Address { get; set; }
        public String City { get; set; }
        public int Capacity { get; set; }        
        public List<string> ImagesURL { get; set; }
        
        public VORecommended() { }

        public VORecommended(int idPublication, string title, string address, string city,
            int capacity, List<string> imagesURL)
        {
            IdPublication = idPublication;
            Title = title;
            Address = address;
            City = city;
            Capacity = capacity;
            ImagesURL = imagesURL;
        }        
    }
}
