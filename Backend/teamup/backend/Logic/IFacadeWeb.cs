using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public interface IFacadeWeb
    {
        bool userExists(string mail);
        bool isMailValidated(String mail);
        VOUser ValidUserLogin(string mail, string password);
        void CreateUser(VORequestUserCreate voUser);
        void UpdateUser(VORequestUserUpdate voUser);
        void DeleteUser(String mail);
        List<VOPublisher> GetPublishers();
        List<VOCustomer> GetCustomers();
        void ApprovePublishers(List<String> mails);
        bool AdminExists(String mail);
        VOAdmin GetAdmin(String mail, String password);
        void RequestPublisher(String mail);
    }
}
