using System;

namespace backend.Logic
{
    public class User
    {
        public Int64 IdUser { get; set; }
        public String Mail { get; set; }
        public String Password { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Phone { get; set; }
        public String UserType { get; set; }


        public User() { }

        public User(Int64 idUser, string mail, string password, string name, string lastName, string phone, string userType)
        {
            IdUser = idUser;
            Mail = mail;
            Password = password;
            Name = name;
            LastName = lastName;
            Phone = phone;
            UserType = userType;
        }
    }
}
