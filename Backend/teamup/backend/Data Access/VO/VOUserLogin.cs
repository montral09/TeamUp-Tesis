using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOUserLogin
    {
        public Int64 IdUser { get; set; }
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public bool CheckPublisher { get; set; }

        public VOUserLogin() { }
        public VOUserLogin(Int64 idUser, string mail, string password, string name, string lastName, string phone, bool checkPublisher)
        {
            IdUser = idUser;
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            CheckPublisher = checkPublisher;
        }
    }
}

