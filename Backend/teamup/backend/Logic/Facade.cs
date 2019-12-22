using backend.Data_Access;
using backend.Data_Access.Query;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Requests;
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
                    result.voUserLog = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Rut, usr.RazonSocial, usr.Address, usr.CheckPublisher, usr.PublisherValidated);
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
                    response.User = new VOUser(usr.Mail, null, usr.Name, usr.LastName, usr.Phone, usr.Rut, usr.RazonSocial, usr.Address, usr.CheckPublisher, usr.PublisherValidated);
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
                    response.User = users.Find(voTokensUpdate.Mail);
                    response.User.Password = null;
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
            User user = null;
            try
            {
                if (mail != null)
                {
                   user = users.Find(mail);
                }
                VOPublication voPublication = spaces.GetSpace(idPublication, user);

                if (voPublication != null)
                {
                    if (mail != null)
                    {
                        isFavorite = spaces.IsFavourite(idPublication, user.IdUser);
                    }
                    List<VOPublication> related = spaces.GetRelatedSpaces(idPublication, voPublication.Capacity, voPublication.SpaceType, voPublication.City);
                    response.Publication = voPublication;
                    response.Favorite = isFavorite;
                    response.RelatedPublications = related;
                    List<VOPublicationQuestion> questions = spaces.GetPublicationQuestions(idPublication);
                    response.Questions = questions;
                    response.responseCode = EnumMessages.SUCC_PUBLICATIONSOK.ToString();
                }
                else
                {
                    response.responseCode = EnumMessages.ERR_SPACENOTFOUND.ToString();
                }                
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
                        if (publisherData != null && (newCodeState == 2 || newCodeState == 6))
                        {
                            util.SendEmailPublicationStatus(publisherData.Mail, publisherData.NamePublisher, publisherData.Title, voUpdateStatePublication.RejectedReason, newCodeState);
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
        public VOResponseUpdateFavorite UpdateFavorite(VORequestUpdateFavorite voUpdateFavorite)
        {
            try
            {
                VOResponseUpdateFavorite response = new VOResponseUpdateFavorite();
                String message = util.ValidAccessToken(voUpdateFavorite.AccessToken, voUpdateFavorite.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voUpdateFavorite.Mail);
                    spaces.UpdateFavorite(voUpdateFavorite, user.IdUser);
                    message = EnumMessages.SUCC_FAVORITEUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public async Task<VOResponseUpdatePublication> UpdatePublication(VORequestUpdatePublication voUpdatePublication)
        {
            try
            {
                VOResponseUpdatePublication response = new VOResponseUpdatePublication();
                String message = util.ValidAccessToken(voUpdatePublication.AccessToken, voUpdatePublication.Publication.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voUpdatePublication.Publication.Mail);
                    await spaces.UpdatePublication(voUpdatePublication, user);
                    message = EnumMessages.SUCC_PUBLICATIONUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseCreateReservation CreateReservation(VORequestCreateReservation voCreateReservation)
        {
            VOResponseCreateReservation response = new VOResponseCreateReservation();
            try
            {
                String message = util.ValidAccessToken(voCreateReservation.AccessToken, voCreateReservation.VOReservation.MailCustomer);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreateReservation.VOReservation.MailCustomer);
                    spaces.CreateReservation(voCreateReservation, user);
                    message = EnumMessages.SUCC_RESERVATIONCREATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetReservationsCustomer GetReservationsCustomer(VORequestGetReservationsCustomer voGetReservationsCustomer)
        {
            {
                VOResponseGetReservationsCustomer response = new VOResponseGetReservationsCustomer();
                try
                {
                    String message = util.ValidAccessToken(voGetReservationsCustomer.AccessToken, voGetReservationsCustomer.Mail);
                    if (EnumMessages.OK.ToString().Equals(message))
                    {
                        User user = users.Find(voGetReservationsCustomer.Mail);
                        response.Reservations = spaces.GetReservationsCustomer(voGetReservationsCustomer, user.IdUser);
                        message = EnumMessages.SUCC_RESERVATIONSOK.ToString();
                    }
                    response.responseCode = message;
                    return response;
                }
                catch (GeneralException e)
                {
                    throw e;
                }

            }
        }

        public VOResponseGetReservationsPublisher GetReservationsPublisher(VORequestGetReservationsPublisher voGetReservationsPublisher)
        {
            VOResponseGetReservationsPublisher response = new VOResponseGetReservationsPublisher();
            try
            {
                String message = util.ValidAccessToken(voGetReservationsPublisher.AccessToken, voGetReservationsPublisher.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voGetReservationsPublisher.Mail);
                    response.Reservations = spaces.GetReservationsPublisher(voGetReservationsPublisher, user.IdUser);
                    message = EnumMessages.SUCC_RESERVATIONSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseUpdateStateReservation UpdateStateReservation(VORequestUpdateStateReservation voUpdateStateReservation)
        {
            VOResponseUpdateStateReservation response = new VOResponseUpdateStateReservation();
            bool isAdmin = false;
            bool updateValid = true;
            try
            {
                String message = util.ValidAccessToken(voUpdateStateReservation.AccessToken, voUpdateStateReservation.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    if (users.AdminMember(voUpdateStateReservation.Mail))
                    {
                        isAdmin = true;
                    }
                    Util util = new Util();
                    int oldCodeRservation = util.ConvertStateReservation(voUpdateStateReservation.OldState);
                    int newCodeReservation = util.ConvertStateReservation(voUpdateStateReservation.NewState);
                    updateValid = util.UpdateValidReservation(isAdmin, oldCodeRservation, newCodeReservation);
                    if (updateValid)
                    {
                        spaces.UpdateStateReservation(voUpdateStateReservation.IdReservation, voUpdateStateReservation.CanceledReason, newCodeReservation, voUpdateStateReservation.NewState, isAdmin);
                        message = EnumMessages.SUCC_RESERVATIONUPDATED.ToString();
                        
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

        public VOResponseUpdateReservation UpdateReservation(VORequestUpdateReservation voUpdateReservation)
        {
            try
            {
                VOResponseUpdateReservation response = new VOResponseUpdateReservation();
                String message = util.ValidAccessToken(voUpdateReservation.AccessToken, voUpdateReservation.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    spaces.UpdateReservation(voUpdateReservation);
                    message = EnumMessages.SUCC_RESERVATIONUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseCreateReview CreateReview(VORequestCreateReview voCreateReview)
        {
            try
            {
                VOResponseCreateReview response = new VOResponseCreateReview();
                String message = util.ValidAccessToken(voCreateReview.AccessToken, voCreateReview.VOReview.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreateReview.VOReview.Mail);
                    spaces.CreateReview(voCreateReview, user.IdUser);
                    message = EnumMessages.SUCC_REVIEWCREATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseCreatePublicationQuestion CreatePublicationQuestion(VORequestCreatePublicationQuestion voCreatePublicationQuestion)
        {
            try
            {
                VOResponseCreatePublicationQuestion response = new VOResponseCreatePublicationQuestion();
                String message = util.ValidAccessToken(voCreatePublicationQuestion.AccessToken, voCreatePublicationQuestion.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreatePublicationQuestion.Mail);
                    spaces.CreatePublicationQuestion(voCreatePublicationQuestion, user.IdUser);
                    message = EnumMessages.SUCC_QUESTIONCREATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }
        public VOResponseCreatePublicationAnswer CreatePublicationAnswer(VORequestCreatePublicationAnswer voCreatePublicationAnswer)
        {
            try
            {
                VOResponseCreatePublicationAnswer response = new VOResponseCreatePublicationAnswer();
                String message = util.ValidAccessToken(voCreatePublicationAnswer.AccessToken, voCreatePublicationAnswer.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreatePublicationAnswer.Mail);
                    spaces.CreatePublicationAnswer(voCreatePublicationAnswer, user.IdUser);
                    message = EnumMessages.SUCC_ANSWERCREATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetPublicationPlans GetPublicationPlans()
        {
            VOResponseGetPublicationPlans response = new VOResponseGetPublicationPlans();
            List<VOPublicationPlan> plans;
            try
            {
                plans = spaces.GetPublicationPlans();
                response.Plans = plans;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        public async Task<VOResponseUpdatePreferentialPayment> UpdatePreferentialPayment(VORequestUpdatePreferentialPayment voUpdatePayment)
        {
            bool isAdmin = false;
            try
            {
                VOResponseUpdatePreferentialPayment response = new VOResponseUpdatePreferentialPayment();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    await spaces.UpdatePreferentialPayment(voUpdatePayment);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public async Task<VOResponsePayReservationCustomer> PayReservationCustomer(VORequestPayReservationCustomer voPayReservationCustomer)
        {
            try
            {
                VOResponsePayReservationCustomer response = new VOResponsePayReservationCustomer();
                String message = util.ValidAccessToken(voPayReservationCustomer.AccessToken, voPayReservationCustomer.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voPayReservationCustomer.Mail);
                    await spaces.PayReservationCustomer(voPayReservationCustomer, user.IdUser);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public async Task<VOResponsePayReservationPublisher> PayReservationPublisher(VORequestPayReservationPublisher voPayReservationPublisher)
        {
            VOResponsePayReservationPublisher response = new VOResponsePayReservationPublisher();
            try
            {
                
                String message = util.ValidAccessToken(voPayReservationPublisher.AccessToken, voPayReservationPublisher.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {                   
                    User user = users.Find(voPayReservationPublisher.Mail);
                    await spaces.PayReservationPublisher(voPayReservationPublisher, user.IdUser);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseUpdatePaymentCustomer UpdatePaymentCustomer(VORequestUpdatePaymentCustomer voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePaymentCustomer response = new VOResponseUpdatePaymentCustomer();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    spaces.UpdatePaymentCustomer(voUpdatePayment);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetPublicationPlanPayments GetPublicationPlanPayments(VORequestGetPublicationPlanPayments voGetPayment)
        {
            VOResponseGetPublicationPlanPayments response = new VOResponseGetPublicationPlanPayments();
            try
            {
                String message = util.ValidAccessToken(voGetPayment.AccessToken, voGetPayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    response.Payments = spaces.GetPublicationPlanPayments();
                    message = EnumMessages.SUCC_PUBLICATIONPLANSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetCommissionPayments GetCommissionPayments(VORequestGetCommissionPayments voGetPayment)
        {
            VOResponseGetCommissionPayments response = new VOResponseGetCommissionPayments();
            try
            {
                String message = util.ValidAccessToken(voGetPayment.AccessToken, voGetPayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    response.Commissions = spaces.GetCommissionPaymentsAdmin();
                    message = EnumMessages.SUCC_COMMISSIONSSOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetFavorites GetFavorites(VORequestGetFavorite voGetFavorite)
        {
            VOResponseGetFavorites response = new VOResponseGetFavorites();
            try
            {
                String message = util.ValidAccessToken(voGetFavorite.AccessToken, voGetFavorite.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User usr = users.Find(voGetFavorite.Mail);
                    response.Publications = spaces.GetFavorites(usr.IdUser);
                    message = EnumMessages.SUCC_FAVORITESOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetRecommendedPublications GetRecommendedPublications()
        {
            VOResponseGetRecommendedPublications response = new VOResponseGetRecommendedPublications();
            try
            {
                response.Recommended = spaces.GetRecommendedPublications();
                String message = EnumMessages.SUCC_FAVORITESOK.ToString();
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseUpdatePreferentialPaymentAdmin UpdatePreferentialPaymentAdmin(VORequestUpdatePreferentialPaymentAdmin voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePreferentialPaymentAdmin response = new VOResponseUpdatePreferentialPaymentAdmin();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    spaces.UpdatePreferentialPaymentAdmin(voUpdatePayment);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseUpdatePaymentCommissionAdmin UpdatePaymentCommissionAdmin(VORequestUpdatePaymentCommissionAdmin voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePaymentCommissionAdmin response = new VOResponseUpdatePaymentCommissionAdmin();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    spaces.UpdatePaymentCommissionAdmin(voUpdatePayment);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        public VOResponseGetMessages GetMessages(VORequestGetMessages voGetMessages)
        {            
            try
            {
                VOResponseGetMessages response = new VOResponseGetMessages();
                String message = util.ValidAccessToken(voGetMessages.AccessToken, voGetMessages.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voGetMessages.Mail);
                    bool isPublisher = users.IsPublisher(voGetMessages.Mail);
                    response.Messages = spaces.GetMessages(voGetMessages, isPublisher, user.IdUser);
                    message = EnumMessages.SUCC_MESSAGESOK.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }

        }
    }
}
