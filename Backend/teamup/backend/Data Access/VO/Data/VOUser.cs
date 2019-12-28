using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOUser
    {
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public String Rut { get; set; }
        public String RazonSocial { get; set; }
        public String Address { get; set; }          
        public bool CheckPublisher { get; set; }
        public bool PublisherValidated { get; set; }
        public String Language { get; set; }

        public VOUser() { }

        public VOUser(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Rut = rut;
            RazonSocial = razonSocial;
            Address = address;
        }

        public VOUser(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address, bool checkPublisher, bool publisherValidated, string language)
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
            Language = language;
        }
    }
}
