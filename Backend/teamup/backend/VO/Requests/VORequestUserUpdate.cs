using backend.Data_Access.VO.Data;
using System;

namespace backend.Data_Access.VO
{
    public class VORequestUserUpdate : VOCustomer
    {
        public String NewMail { get; set; }
        public String AccessToken { get; set; }

        public VORequestUserUpdate(Int64 idUser, string mail,
            string password, string name, string lastName, string phone, bool active, string languageDescription, int languageCode,
            bool checkPublisher, string rut, string razonSocial, string address, bool mailValidated, String newMail, String accessToken) 
            : base (idUser, mail, password, name, lastName, phone, active, languageDescription, languageCode, checkPublisher, 
                  rut, razonSocial, address, mailValidated)
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
            CheckPublisher = checkPublisher;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
            MailValidated = mailValidated;
            NewMail = newMail;
            AccessToken = accessToken;
        }
    }
}

