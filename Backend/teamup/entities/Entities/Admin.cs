using backend.Logic.Entities;
using System;

namespace backend.Logic
{
    public class Admin : User
    {               
        public Admin() { }

        public Admin (Int64 idUser, string mail, string password, string name, string lastName,
            string phone, bool active, string languageDescription, int languageCode) : base (idUser, mail, password, name, lastName, phone, active, 
                languageDescription, languageCode) 
        {
            IdUser = idUser;
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Active = active;
            LanguageDescription = languageDescription;
            LanguageCode = languageCode;
        }
    }
}
