using System;

namespace backend.Logic
{
    public class User
    {
        public Int64 IdUser { get; set; }
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public bool CheckPublisher { get; set; }       
        public String Rut { get; set; }
        public String RazonSocial { get; set; }
        public String Address { get; set; }
        public bool MailValidated { get; set; }
        public bool PublisherValidated { get; set; }
        public bool Active { get; set; }
        public string LanguageDescription { get; set; }
        public int LanguageCode { get; set; }


        public User() { }

        public User(Int64 idUser, string mail, string password, string name, string lastName, string phone, bool checkPublisher, string rut, string razonSocial, string address, bool mailValidated, bool publisherValidated, bool active, string languageDescription, int languageCode)
        {
            IdUser = idUser;
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            CheckPublisher = checkPublisher;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
            MailValidated = mailValidated;
            PublisherValidated = publisherValidated;
            Active = active;
            LanguageDescription = languageDescription;
            LanguageCode = languageCode;
        }

        public User(string mail, string password, string name, string lastName, string phone, bool checkPublisher, string rut, string razonSocial, string address, bool mailValidated, bool publisherValidated, bool active, string languageDescription, int languageCode)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            CheckPublisher = checkPublisher;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
            MailValidated = mailValidated;
            PublisherValidated = publisherValidated;
            Active = active;
            LanguageDescription = languageDescription;
            LanguageCode = languageCode;
        }

        /*Admin's constructor*/
        public User(string mail, string password, string name, string lastName, string phone, bool active)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Active = active;
        }
    }
}
