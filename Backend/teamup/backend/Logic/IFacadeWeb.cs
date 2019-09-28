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
        VOResponseLogin ValidUserLogin(string mail, string password);
        void CreateUser(VORequestUserCreate voUser);
        void UpdateUser(VORequestUserUpdate voUser);
        void DeleteUser(String mail);
        List<VOPublisher> GetPublishers();
        List<VOCustomer> GetCustomers();
        void ApprovePublishers(List<String> mails);
        VOResponseAdminLogin GetAdmin(String mail, String password);
        void RequestPublisher(String mail);
        List<VOSpaceType> GetSpaceTypes();
        List<VOLocation> GetLocations();
        void CreateTokens(String mail);
        void RecoverPassword(VORequestPasswordRecovery voPasswordRecovery);
        int ValidateEmail(VORequestValidateEmail voValidateEmail);
        string UpdateUserAdmin(VORequestUpdateUserAdmin voRequestUpdate);
        VOResponseGetUsers GetUsers(VORequestGetUsers voRequest);
    }
}
