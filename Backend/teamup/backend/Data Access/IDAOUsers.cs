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
        User Find(string mail);
        void InsertUser(User user);
        void UpdateUser(User user);
        bool ValidateDeletion(String mail);
        void DeleteUser(String mail);
        List<VOPublisher> GetPublishers();
        List<VOCustomer> GetCustomers();
        void ApprovePublishers(List<String> mails);
        bool AdminExists(String user);
        Admin GetAdmin(String mail, String password);
    }
}
