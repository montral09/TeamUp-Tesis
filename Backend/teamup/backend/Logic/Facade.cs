using backend.Data_Access;
using backend.Data_Access.Query;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Responses;
using backend.Exceptions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Logic
{
    public class Facade : IFacadeWeb
    {
        private IDAOUsers users;
        private IDAOSpaces spaces;
        private IDAOUtil util;
        public Facade()
        {
            users = new DAOUsers();
            spaces = new DAOSpaces();
            util = new DAOUtil();
        }

        /* This function will check if the user email is exists*/
        public bool UserExists(string mail)
        {
            try
            {
                if (users.Member(mail))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public bool AdminExists(string mail)
        {
            try
            {
                if (users.AdminMember(mail))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        public bool IsMailValidated(String mail)
        {
            try
            {
                if (users.IsMailValidated(mail))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        /* This function will return the user or null if user/password doesn't match  */
        public VOResponseLogin ValidUserLogin(string mail, string password)
        {
            VOResponseLogin result = null;
            try
            {
                User usr = users.Find(mail);
                PasswordHasher passwordHasher = new PasswordHasher();
                if (usr != null && passwordHasher.VerifyHashedPassword(usr.Password, password))
                {
                    VOTokens voTokens = users.CreateTokens(mail);
                    result = new VOResponseLogin();
                    result.RefreshToken = voTokens.RefreshToken;
                    result.AccessToken = voTokens.AccessToken;
                    result.voUserLog = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Rut, usr.RazonSocial, usr.Address, usr.CheckPublisher);
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return result;
        }

        /* This function creates a new user (publisher, or customer)  */
        public void CreateUser(VORequestUserCreate voUser)
        {
            try
            {
                User u = new User(voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false, false, true);
                users.InsertUser(u);

            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        /* This function updates data from an specific user  */
        public VOResponseUserUpdate UpdateUser(VORequestUserUpdate voUser)
        {
            try
            {
                VOResponseUserUpdate response = new VOResponseUserUpdate();
                String message = util.ValidAccessToken(voUser.AccessToken, voUser.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User u = new User(voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false, false, true);
                    users.UpdateUser(u, voUser.NewMail);
                    message = EnumMessages.SUCC_USRUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function set user as inactive. There is no physical deletion from DB  */
        public VOResponseUserDelete DeleteUser(VORequestUserDelete voUserDelete)
        {
            try
            {
                VOResponseUserDelete response = new VOResponseUserDelete();
                String message = util.ValidAccessToken(voUserDelete.AccessToken, voUserDelete.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    if (users.ValidateDeletion(voUserDelete.Mail))
                    {
                        users.DeleteUser(voUserDelete.Mail);
                        message = EnumMessages.SUCC_USRDELETED.ToString();
                    }
                    else
                    {
                        message = EnumMessages.ERR_PENDINGPROCESSES.ToString();
                    }
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function obtains all Publishers  */
        public VOResponseGetPublishers GetPublishers(VORequestGetPublishers voPublishers)
        {
            try
            {
                VOResponseGetPublishers response = new VOResponseGetPublishers();
                String message = util.ValidAccessToken(voPublishers.AccessToken, voPublishers.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    response.voUsers = users.GetPublishers();
                    message = EnumMessages.SUCC_PUBLISHERSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }

        }
        /* This function obtains all Customers  */
        public List<VOCustomer> GetCustomers()
        {
            List<VOCustomer> customers = new List<VOCustomer>();
            try
            {
                customers = users.GetCustomers();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return customers;
        }
        /* This function recieve a list of Publishers to be approved  */
        public VOResponseApprovePublishers ApprovePublishers(VORequestApprovePublishers voPublishers)
        {
            try
            {
                VOResponseApprovePublishers response = new VOResponseApprovePublishers();
                String message = util.ValidAccessToken(voPublishers.AccessToken, voPublishers.AdminMail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    users.ApprovePublishers(voPublishers.Mails);
                    message = EnumMessages.SUCC_PUBLISHERSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function returns admin user  */
        public VOResponseAdminLogin GetAdmin(string mail, string password)
        {
            VOResponseAdminLogin result = null;
            try
            {
                Admin usr = users.GetAdmin(mail, password);
                PasswordHasher passwordHasher = new PasswordHasher();
                if (usr != null && passwordHasher.VerifyHashedPassword(usr.Password, password))
                {
                    VOTokens voTokens = users.CreateTokens(mail);
                    result = new VOResponseAdminLogin();
                    result.voAdmin = new VOAdmin(usr.Mail, null, usr.Name, usr.LastName, usr.Phone);
                    result.RefreshToken = voTokens.RefreshToken;
                    result.AccessToken = voTokens.AccessToken;
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return result;
        }

        /*This function update a customer who wants to be a publisher*/
        public VOResponseRequestPublisher RequestPublisher(VORequestRequestPublisher voRequestRequestPublisher)
        {
            try
            {
                VOResponseRequestPublisher response = new VOResponseRequestPublisher();
                String message = util.ValidAccessToken(voRequestRequestPublisher.AccessToken, voRequestRequestPublisher.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    users.RequestPublisher(voRequestRequestPublisher.Mail);
                    message = EnumMessages.SUCC_USRUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /*This function return all types of spaces*/
        public List<VOSpaceType> GetSpaceTypes()
        {
            List<VOSpaceType> spaceTypes = new List<VOSpaceType>();
            try
            {
                spaceTypes = spaces.GetSpaceTypes();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return spaceTypes;
        }

        /*This function return all locations available*/
        public List<VOLocation> GetLocations()
        {
            List<VOLocation> locations = new List<VOLocation>();
            try
            {
                locations = spaces.GetLocations();
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return locations;
        }

        public void CreateTokens(String mail)
        {
            try
            {
                users.CreateTokens(mail);
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public void RecoverPassword(VORequestPasswordRecovery voPasswordRecovery)
        {
            try
            {
                users.UpdatePassword(voPasswordRecovery.Mail);

            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public int ValidateEmail(VORequestValidateEmail voValidateEmail)
        {
            try
            {
                return users.ValidateEmail(voValidateEmail.ActivationCode);
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public string UpdateUserAdmin(VORequestUpdateUserAdmin voRequestUpdate)
        {
            try
            {
                String message = util.ValidAccessToken(voRequestUpdate.AccessToken, voRequestUpdate.AdminMail);
                if (!voRequestUpdate.OriginalMail.Equals(voRequestUpdate.Mail))
                {
                    if (users.Member(voRequestUpdate.Mail))
                    {
                        message = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                    }
                }
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    users.UpdateUserAdmin(voRequestUpdate);

                }
                return message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /* This function obtains all users  */
        public VOResponseGetUsers GetUsers(VORequestGetUsers voRequest)
        {
            VOResponseGetUsers response = new VOResponseGetUsers();
            List<VOUserAdmin> usersList = new List<VOUserAdmin>();
            try
            {
                String message = util.ValidAccessToken(voRequest.AccessToken, voRequest.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    usersList = users.GetUsers();
                    response.voUsers = usersList;
                }
                response.responseCode = message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        public VOResponseGetUserData GetUserData(VORequestGetUserData voRequestUserData)
        {
            VOResponseGetUserData response = new VOResponseGetUserData();
            try
            {
                string message;
                User usr = users.GetUserData(voRequestUserData);
                if (usr != null)
                {
                    message = EnumMessages.SUCC_USERSOK.ToString();
                    response.User = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Rut, usr.RazonSocial, usr.Address, usr.CheckPublisher);
                }
                else
                {
                    message = EnumMessages.ERR_INVALIDACCESSTOKEN.ToString();
                }
                response.responseCode = message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        public VOResponseTokensUpdate UpdateTokens(VORequestTokensUpdate voTokensUpdate)
        {
            VOResponseTokensUpdate response = new VOResponseTokensUpdate();
            try
            {
                String message = util.ValidRefreshToken(voTokensUpdate.RefreshToken, voTokensUpdate.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    VOTokens voTokens = users.CreateTokens(voTokensUpdate.Mail);
                    response.RefreshToken = voTokens.RefreshToken;
                    response.AccessToken = voTokens.AccessToken;
                    message = EnumMessages.SUCC_TOKENSUPDATED.ToString();
                }
                response.responseCode = message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }
        public VOResponseGetReservationTypes GetReservationTypes(VORequestGetReservationTypes voRequestReservationTypes)
        {
            VOResponseGetReservationTypes response = new VOResponseGetReservationTypes();
            List<VOReservationType> reservationTypes = new List<VOReservationType>();
            try
            {
                String message = util.ValidAccessToken(voRequestReservationTypes.AccessToken, voRequestReservationTypes.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    reservationTypes = spaces.GetReservationTypes();
                    response.reservationTypes = reservationTypes;
                }
                response.responseCode = message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }
        public VOResponseGetFacilities GetFacilities()
        {
            VOResponseGetFacilities response = new VOResponseGetFacilities();
            List<VOFacility> facilities;
            try
            {
                facilities = spaces.GetFacilities();
                response.facilities = facilities;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        public async Task<VOResponseCreatePublication> CreatePublication(VORequestCreatePublication voCreatePublication)
        {
            VOResponseCreatePublication response = new VOResponseCreatePublication();
            try
            {
                String message = util.ValidAccessToken(voCreatePublication.AccessToken, voCreatePublication.VOPublication.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreatePublication.VOPublication.Mail);
                    await spaces.CreatePublicationAsync(voCreatePublication, user);
                    message = EnumMessages.SUCC_PUBLICATIONCREATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponsePublicationPendingApproval GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval)
        {
            VOResponsePublicationPendingApproval response = new VOResponsePublicationPendingApproval();
            try
            {
                String message = util.ValidAccessToken(voPublicationPendingApproval.AccessToken, voPublicationPendingApproval.AdminMail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    response.Publications = spaces.GetPublicationsPendingApproval(voPublicationPendingApproval);
                    message = EnumMessages.SUCC_PUBLICATIONSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetPublisherSpaces GetPublisherSpaces(VORequestGetPublisherSpaces voRequestGetPublisherSpaces)
        {
            VOResponseGetPublisherSpaces response = new VOResponseGetPublisherSpaces();
            try
            {
                String message = util.ValidAccessToken(voRequestGetPublisherSpaces.AccessToken, voRequestGetPublisherSpaces.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    response.Publications = spaces.GetPublisherSpaces(voRequestGetPublisherSpaces.Mail);
                    message = EnumMessages.SUCC_PUBLICATIONSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetSpace GetSpace(int idPublication, string mail)
        {
            VOResponseGetSpace response = new VOResponseGetSpace();
            bool isFavorite = false;
            try
            {
                VOPublication voPublication = spaces.GetSpace(idPublication);

                if (voPublication != null)
                {
                    if (mail != null)
                    {
                        User user = users.Find(mail);
                        isFavorite = spaces.IsFavourite(idPublication, user.IdUser);
                    }
                    List<VOPublication> related = spaces.GetRelatedSpaces(idPublication, voPublication.Capacity, voPublication.SpaceType);
                    response.Publication = voPublication;                    
                    response.Favorite = isFavorite;
                    response.RelatedPublications = related;
                }
                else
                {
                    response.responseCode = EnumMessages.ERR_SPACENOTFOUND.ToString();
                }
                response.responseCode = EnumMessages.SUCC_PUBLICATIONSOK.ToString();
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseUpdateStatePublication UpdateStatePublication(VORequestUpdateStatePublication voUpdateStatePublication)
        {
            VOResponseUpdateStatePublication response = new VOResponseUpdateStatePublication();
            bool isAdmin = false;
            bool updateValid = true;
            try
            {
                String message = util.ValidAccessToken(voUpdateStatePublication.AccessToken, voUpdateStatePublication.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    if (users.AdminMember(voUpdateStatePublication.Mail))
                    {
                        isAdmin = true;
                    }
                    Util util = new Util();
                    int oldCodeState = util.ConvertState(voUpdateStatePublication.OldState);
                    int newCodeState = util.ConvertState(voUpdateStatePublication.NewState);
                    updateValid = util.UpdateValid(isAdmin, oldCodeState, newCodeState);
                    if (updateValid)
                    {
                        VOPublicationAdmin publisherData = spaces.UpdateStatePublication(voUpdateStatePublication.IdPublication, voUpdateStatePublication.RejectedReason, newCodeState, isAdmin);
                        message = EnumMessages.SUCC_PUBLICATIONUPDATED.ToString();
                        if (newCodeState == 2 || newCodeState == 6)
                        {
                            util.SendEmailPublicationStatus(publisherData.Mail, publisherData.NamePublisher, publisherData.Title, voUpdateStatePublication.RejectedReason,newCodeState);
                        }
                    }
                    else
                    {
                        message = EnumMessages.ERR_INVALIDUPDATE.ToString();
                    }
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter)
        {
            {
                VOResponseGetPublicationsWithFilters response = new VOResponseGetPublicationsWithFilters();
                try
                {
                    response = spaces.GetPublicationsWithFilters(voGetPublicationsFilter);
                }
                catch (GeneralException e)
                {
                    throw e;
                }
                response.responseCode = EnumMessages.SUCC_PUBLICATIONSOK.ToString();
                return response;

            }

            }
    }
}
