using System;

namespace backend.Data_Access.VO.Data
{
    public class VOUser
    {
        public Int64 IdUser { get; set; }
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public bool Active { get; set; }
        public string Language { get; set; }
        public int LanguageCode { get; set; }

        public VOUser() { }

        public VOUser(Int64 idUser, string mail, string password, string name, string lastName, string phone, bool active,
            string languageDescription, int languageCode)
        {
            IdUser = idUser;
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Active = active;
            Language = languageDescription;
            LanguageCode = languageCode;
        }
    }
}
