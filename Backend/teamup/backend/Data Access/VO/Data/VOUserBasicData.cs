using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOUserBasicData
    {
        public String Mail { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        
        public VOUserBasicData() { }

        public VOUserBasicData(String mail, String name, String lastName)
        {
            Mail = mail;
            Name = name;
            LastName = lastName;            
        }       
    }
}
