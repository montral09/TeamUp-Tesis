using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdateUserAdmin : VOTokens
    {
        public String Mail { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public String Rut { get; set; }
        public String RazonSocial { get; set; }
        public String Address { get; set; }
        public bool CheckPublisher { get; set; }
        public bool PublisherValidated { get; set; }
        public bool MailValidated { get; set; }
        public bool Active { get; set; }

        public VORequestUpdateUserAdmin() { }
        public VORequestUpdateUserAdmin(string mail, string name, string lastName, string phone, string rut,
            string razonSocial, string address, bool checkPublisher, bool publisherValidated, bool mailValidated, bool active, string accessToken)
            : base (accessToken)

        {
            Mail = mail;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
            CheckPublisher = checkPublisher;
            PublisherValidated = publisherValidated;
            MailValidated = mailValidated;
            AccessToken = accessToken;
            Active = active;
        }
    }
}

