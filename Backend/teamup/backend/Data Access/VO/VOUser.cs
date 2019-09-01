using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOUser
    {
   
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public bool CheckPublisher { get; set; }
        public String Rut { get; set; }
        public String RazonSocial { get; set; }
        public String Address { get; set; }

        public VOUser(String mail, String password, String name, String lastName, String phone, bool checkPublisher, String rut, String razonSocial, String address)
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
        }

        /*Admin's constructor*/
        public VOUser(String mail, String password, String name, String lastName, String phone, String address)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            Address = address;
        }

        public VOUser() { }

    }
}
