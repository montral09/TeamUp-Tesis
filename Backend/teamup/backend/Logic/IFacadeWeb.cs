﻿using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public interface IFacadeWeb
    {
        bool UserExists(string mail);
        bool AdminExists(string mail);
        bool IsMailValidated(String mail);
        VOResponseLogin ValidUserLogin(string mail, string password);
        void CreateUser(VORequestUserCreate voUserCreate);
        VOResponseUserUpdate UpdateUser(VORequestUserUpdate voUserUpdate);
        VOResponseUserDelete DeleteUser(VORequestUserDelete voUserDelete);
        List<VOPublisher> GetPublishers();
        List<VOCustomer> GetCustomers();
        VOResponseApprovePublishers ApprovePublishers(VORequestApprovePublishers voPublishers);
        VOResponseAdminLogin GetAdmin(String mail, String password);
        VOResponseRequestPublisher RequestPublisher(VORequestRequestPublisher voRequestRequestPublisher);
        List<VOSpaceType> GetSpaceTypes();
        List<VOLocation> GetLocations();
        void CreateTokens(String mail);
        void RecoverPassword(VORequestPasswordRecovery voPasswordRecovery);
        int ValidateEmail(VORequestValidateEmail voValidateEmail);
        string UpdateUserAdmin(VORequestUpdateUserAdmin voRequestUpdateUser);
        VOResponseGetUsers GetUsers(VORequestGetUsers voRequestGetUsers);
        VOResponseGetUserData GetUserData(VORequestGetUserData voUserData);
        VOResponseTokensUpdate UpdateTokens(VORequestTokensUpdate voTokensUpdate);
    }
}
