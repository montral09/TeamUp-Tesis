using System;

namespace backend.Logic
{
    public class UserBasicData
    {
        public String Mail { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public int Language { get; set; }

        public UserBasicData() { }

        public UserBasicData(String mail, String name, String lastName, int language)
        {
            Mail = mail;
            Name = name;
            LastName = lastName;
            Language = language;
        }
    }
}
