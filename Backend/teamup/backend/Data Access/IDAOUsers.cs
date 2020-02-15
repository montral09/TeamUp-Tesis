using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Logic;
using backend.Logic.Entities;

namespace backend.Data_Access.Query
{
    interface IDAOUsers
    {
        bool Member(String user);
        bool AdminMember(String user);
        bool IsMailValidated(String mail);
        User Find(string mail);
        string InsertUser(User user);
        string UpdateUser(User user, String newMail);
        String ValidateDeletion(String mail);
        void DeleteUser(String mail);
        List<User> GetPublishers();
        void ApprovePublishers(List<String> mails);
        Admin GetAdmin(String mail, String password);
        void RequestPublisher(String mail);
        Tokens CreateTokens(String mail);
        string UpdatePassword(String mail);
        int ValidateEmail(String activationCode);
        void UpdateUserAdmin(string mail, string name, string lastName, string phone, bool checkPublisher,
                        string rut, string razonSocial, string address, bool mailValidated, bool publisherValidated, bool active);
        List<User> GetUsers();
        User GetUserData(string accessToken);
        bool IsPublisher(String mail);
        int GetIdLanguageByDescription(String descLanguage);

    }
}
