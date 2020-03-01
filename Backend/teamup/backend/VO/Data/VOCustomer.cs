using System;

namespace backend.Data_Access.VO.Data
{
    public class VOCustomer : VOUser
    {
        public bool CheckPublisher { get; set; }
        public String Rut { get; set; }
        public String RazonSocial { get; set; }
        public String Address { get; set; }
        public bool MailValidated { get; set; }

        public VOCustomer() { }

        public VOCustomer(Int64 idUser, string mail,
            string password, string name, string lastName, string phone, bool active, string languageDescription, int languageCode,
            bool checkPublisher, string rut, string razonSocial, string address, bool mailValidated) : base(
                idUser, mail, password, name, lastName, phone, active, languageDescription, languageCode)
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
        }
    }
}
