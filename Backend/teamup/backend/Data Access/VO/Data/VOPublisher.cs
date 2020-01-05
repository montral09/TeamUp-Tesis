using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOPublisher : VOUser
    { 
        public bool PublisherValidated { get; set; }
        public bool MailValidated { get; set; }

        public VOPublisher() { }

        public VOPublisher(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address, bool publisherValidated, bool mailValidated)
            : base(mail, password, name, lastName, phone, rut, razonSocial, address)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
            PublisherValidated = publisherValidated;
            MailValidated = mailValidated;
        }
    }
}
