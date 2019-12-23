using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOUserAdmin : VOUser
    {
        public bool MailValidated { get; set; }
        public bool PublisherValidated { get; set; }
        public bool Active { get; set; }

        public VOUserAdmin() { }

        public VOUserAdmin(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address, bool checkPublisher, bool mailValidated, bool publisherValidated, bool active)
            : base (mail, password, name, lastName, phone, rut, razonSocial, address, checkPublisher, publisherValidated)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
            CheckPublisher = checkPublisher;
            PublisherValidated = publisherValidated;
            MailValidated = mailValidated;
            Active = active;
        }
    }
}
