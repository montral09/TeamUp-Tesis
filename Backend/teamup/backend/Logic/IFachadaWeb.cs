using backend.Data_Access.VO;
using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public interface IFachadaWeb
    {
        bool userExists(string mail);
        VOUserLogin ValidUserLogin(string mail, string password);
        void CreateUser(VOUser voUser);
        void UpdateUser(VOUser voUser);
        void DeleteUser(String mail);
        List<VOUser> GetPublishers();
        List<VOUser> GetCustomers();
        void ApprovePublishers(List<VOUser> publishers);
        bool AdminExists(String mail);
        VOUser GetAdmin(String mail, String password);
    }
}
