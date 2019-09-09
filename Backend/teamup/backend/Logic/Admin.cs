using System;

namespace backend.Logic
{
    public class Admin
    {
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
               
        public Admin() { }

        public Admin(String mail, String password, String name, String lastName, String phone)
        {
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
        }
    }
}
