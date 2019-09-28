using System;
using System.Collections.Generic;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Logic;

namespace backend.Data_Access.Query
{
    interface IDAOUsers
    {
        bool Member(String user);
        bool isMailValidated(String mail);
        User Find(string mail);
        void InsertUser(User user);
        void UpdateUser(User user, String newMail);
        bool ValidateDeletion(String mail);
        void DeleteUser(String mail);
        List<VOPublisher> GetPublishers();
        List<VOCustomer> GetCustomers();
        void ApprovePublishers(List<String> mails);
        Admin GetAdmin(String mail, String password);
        void RequestPublisher(String mail);
        VOTokens CreateTokens(String mail);
        bool ValidAccessToken(String mail, String accessToken);
        void UpdatePassword(String mail);
        int ValidateEmail(String activationCode);
        void UpdateUserAdmin(VORequestUpdateUserAdmin voRequest);
        List<VOUserAdmin> GetUsers();
    }
}
