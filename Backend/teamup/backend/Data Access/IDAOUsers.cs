using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Logic;

namespace backend.Data_Access.Query
{
    interface IDAOUsers
    {
        bool Member(String user);
        bool AdminMember(String user);
        bool IsMailValidated(String mail);
        User Find(string mail);
        Task InsertUser(User user);
        Task UpdateUser(User user, String newMail);
        bool ValidateDeletion(String mail);
        void DeleteUser(String mail);
        List<VOPublisher> GetPublishers();
        List<VOCustomer> GetCustomers();
        void ApprovePublishers(List<String> mails);
        Admin GetAdmin(String mail, String password);
        void RequestPublisher(String mail);
        VOTokens CreateTokens(String mail);
        bool ValidAccessToken(String mail, String accessToken);
        Task UpdatePassword(String mail);
        int ValidateEmail(String activationCode);
        void UpdateUserAdmin(VORequestUpdateUserAdmin voRequest);
        List<VOUserAdmin> GetUsers();
        User GetUserData(VORequestGetUserData voRequestUserData);
        bool IsPublisher(String mail);

    }
}
