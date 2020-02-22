using System;
using System.Collections.Generic;
using backend.Logic;
using backend.Logic.Entities;

namespace backend.Data_Access.Query
{
    public interface IDAOUsers
    {
        bool Member(String user);
        bool AdminMember(String user);
        bool IsMailValidated(String mail);
        Publisher Find(string mail);
        string InsertUser(Customer user);
        string UpdateUser(Customer user, String newMail);
        String ValidateDeletion(String mail);
        void DeleteUser(String mail);
        List<Publisher> GetPublishers();
        void ApprovePublishers(List<String> mails);
        Admin GetAdmin(String mail, String password);
        void RequestPublisher(String mail);
        Tokens CreateTokens(String mail);
        string UpdatePassword(String mail);
        int ValidateEmail(String activationCode);
        void UpdateUserAdmin(string mail, string name, string lastName, string phone, bool checkPublisher,
                        string rut, string razonSocial, string address, bool mailValidated, bool publisherValidated, bool active);
        List<Publisher> GetUsers();
        Publisher GetUserData(string accessToken);
        bool IsPublisher(String mail);
        int GetIdLanguageByDescription(String descLanguage);
        void InsertDeviceToken(string mail, string deviceToken);
        String GetDeviceToken(string mail);

    }
}
