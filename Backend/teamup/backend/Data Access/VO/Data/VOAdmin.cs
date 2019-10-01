using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOAdmin
    {
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }

        public VOAdmin() { }

        public VOAdmin(String mail, String password, String name, String lastName, String phone)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
        }
    }
}
