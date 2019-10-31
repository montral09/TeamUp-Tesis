using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        VOResponseGetPublishers GetPublishers(VORequestGetPublishers voPublishers);
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
        VOResponseGetReservationTypes GetReservationTypes(VORequestGetReservationTypes voRequestReservationTypes);
        VOResponseGetFacilities GetFacilities();
        Task<VOResponseCreatePublication> CreatePublication(VORequestCreatePublication voCreatePublication);
        VOResponsePublicationPendingApproval GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval);
        VOResponseGetPublisherSpaces GetPublisherSpaces(VORequestGetPublisherSpaces voRequestGetPublisherSpaces);
        VOResponseGetSpace GetSpace(int idPublication, string mail);
        VOResponseUpdateStatePublication UpdateStatePublication(VORequestUpdateStatePublication voUpdateStatePublication);
        VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter);
    }
}
