using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOCustomer : VOUser
    { 
        public bool MailValidated { get; set; }

        public VOCustomer() { }

        public VOCustomer(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address, bool mailValidated)
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
            MailValidated = mailValidated;
        }
    }
}
