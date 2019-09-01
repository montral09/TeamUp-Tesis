using System;
using System.Collections.Generic;
using backend.Data_Access.VO;
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
        List<VOUser> GetPublishers();
        List<VOUser> GetCustomers();
        void ApprovePublishers(List<VOUser> publishers);
        bool AdminExists(String user);
        User GetAdmin(String mail, String password);
    }
}
