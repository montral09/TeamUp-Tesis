using backend.Data_Access;
using backend.Data_Access.Query;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Requests;
using backend.Data_Access.VO.Responses;
using backend.Exceptions;
using backend.Logic.Converters.EntityToVO;
using backend.Logic.Converters.VOToEntity;
using backend.Logic.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using TeamupML.Model;
using Microsoft.ML;

namespace backend.Logic
{
    public class Facade : IFacade
    {
        private IDAOUsers users;
        private IDAOSpaces spaces;
        private IDAOUtil util;
        private EmailUtil emailUtil = new EmailUtil();
        private const int RESERVATION_CANCELED_STATE = 5;
        private const int RESERVATION_RESERVED_STATE = 2;
        private const int PUBLICATION_APPROVED = 2;
        private const int PUBLICATION_REJECTED = 6;
        private string projectName = ConfigurationManager.AppSettings["PROJECT_NAME"];

        private Facade()
        {
            users = new DAOUsers();
            spaces = new DAOSpaces();
            util = new DAOUtil();
        }

        public static Facade Instance { get; } = new Facade();

        /// <summary>
        /// Checks if the user email exists
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true is user exists </returns>
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
        /// <summary>
        /// Checks if the user email of admin exists
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true if admin exists</returns>
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
        /// <summary>
        /// Returns if mail is validated 
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true if mail is validated </returns>
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
        /// <summary>
        /// Returns the user or null if user/password doesn't match and saves deviceToken if is not null
        /// </summary>
        /// <param name="mail"></param>
        /// <param name="password"></param>
        /// <returns> Generated tokens </returns>
        public VOResponseLogin ValidUserLogin(string mail, string password)
        {
            VOResponseLogin result = null;
            try
            {
                Publisher usr = users.Find(mail);
                PasswordHasher passwordHasher = new PasswordHasher();
                if (usr != null && passwordHasher.VerifyHashedPassword(usr.Password, password))
                {
                    Tokens tokens = users.CreateTokens(mail);                   
                    result = new VOResponseLogin();
                    result.RefreshToken = tokens.RefreshToken;
                    result.AccessToken = tokens.AccessToken;
                    result.voUserLog = new VOPublisher(0, usr.Mail, null, usr.Name, usr.LastName, usr.Phone, false, usr.LanguageDescription, 0, usr.CheckPublisher, usr.Rut, usr.RazonSocial, usr.Address, true, usr.PublisherValidated);
                }
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return result;
        }

        /// <summary>
        /// Creates a new user (publisher, or customer) and 
        /// sends mail to user with an activation link
        /// </summary>
        /// <param name="voUser"></param>
        public VOResponseUserCreate CreateUser(VORequestUserCreate voUser)
        {
            VOResponseUserCreate response = new VOResponseUserCreate();
            try
            {
                String message;
                bool userMailExists = UserExists(voUser.Mail);
                if (userMailExists == true)
                {
                    message = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                }
                else
                {
                    Customer user = new Customer(0, voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone,
                        false, voUser.Language, 0, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false);                    
                    string activationCode = users.InsertUser(user);
                    int languageCode = users.GetIdLanguageByDescription(voUser.Language);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    string activationLink = ConfigurationManager.AppSettings["ACTIVATION_LINK"] + activationCode;
                    keyValuePairs[ParamCodes.USER_NAME] = voUser.Name;
                    keyValuePairs[ParamCodes.ACTIVATION_LINK] = activationLink;
                    keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                    EmailDataGeneric mailData = emailUtil.GetFormatMailUsers(EmailFormatCodes.CODE_USER_CREATED, languageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(voUser.Mail, mailData.Body, mailData.Subject);
                    message = EnumMessages.SUCC_USRCREATED.ToString();
                }
                response.responseCode = message;
                return response;
            } catch (GeneralException e)
            {
                throw e;
            }            
        }

        /// <summary>
        /// Updates user data and sends mail to user with an activation link
        /// </summary>
        /// <param name="voUser"></param>
        public VOResponseUserUpdate UpdateUser(VORequestUserUpdate voUser)
        {

            VOResponseUserUpdate response = new VOResponseUserUpdate();
            try
            {
                String message;
                message = util.ValidAccessToken(voUser.AccessToken, voUser.Mail);
                if (EnumMessages.OK.ToString().Equals(message)) {
                    if (!voUser.Mail.Equals(voUser.NewMail))
                    {
                        // Check if new mail already exists
                        Boolean mailAlreadyExists = UserExists(voUser.NewMail);
                        if (mailAlreadyExists)
                        {
                            message = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                            response.responseCode = message;
                            return response;
                        }
                    }
                    Customer user = new Customer(0, voUser.Mail, voUser.Password, voUser.Name, voUser.LastName, voUser.Phone,
                        false, voUser.Language, 0, voUser.CheckPublisher, voUser.Rut, voUser.RazonSocial, voUser.Address, false);
                    string activationCode = users.UpdateUser(user, voUser.NewMail);
                    if (!String.IsNullOrEmpty(activationCode))
                    {
                        int languageCode = users.GetIdLanguageByDescription(voUser.Language);
                        Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                        string activationLink = ConfigurationManager.AppSettings["ACTIVATION_LINK"] + activationCode;
                        keyValuePairs[ParamCodes.USER_NAME] = voUser.Name;
                        keyValuePairs[ParamCodes.ACTIVATION_LINK] = activationLink;
                        EmailDataGeneric mailData = emailUtil.GetFormatMailUsers(EmailFormatCodes.CODE_USER_MODIFIED, languageCode, keyValuePairs);
                        emailUtil.SendEmailAsync(voUser.Mail, mailData.Body, mailData.Subject);
                    }                   
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

        /// <summary>
        /// Set user as inactive and sends mail to user.
        /// There is no physical deletion from DB
        /// </summary>
        /// <param name="voUserDelete"></param>
        public VOResponseUserDelete DeleteUser(VORequestUserDelete voUserDelete)
        {
            try
            {
                VOResponseUserDelete response = new VOResponseUserDelete();
                String message = util.ValidAccessToken(voUserDelete.AccessToken, voUserDelete.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    String resultValidateDeletion = users.ValidateDeletion(voUserDelete.Mail);
                    if (resultValidateDeletion == null)
                    {
                        users.DeleteUser(voUserDelete.Mail);
                        User user = users.Find(voUserDelete.Mail);
                        Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                        keyValuePairs[ParamCodes.USER_NAME] = user.Name;
                        EmailDataGeneric mailData = emailUtil.GetFormatMailUsers(EmailFormatCodes.CODE_USER_DELETED, user.LanguageCode, keyValuePairs);
                        emailUtil.SendEmailAsync(voUserDelete.Mail, mailData.Body, mailData.Subject);
                        message = EnumMessages.SUCC_USRDELETED.ToString();
                    }
                    else
                    {
                        message = resultValidateDeletion;
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

        /// <summary>
        /// Gets publishers pending confirmation
        /// </summary>
        /// <param name="voRequestGetPublishers"></param>
        /// <returns> Users </returns>
        public VOResponseGetPublishers GetPublishers(VORequestGetPublishers voRequestGetPublishers)
        {
            try
            {
                VOResponseGetPublishers response = new VOResponseGetPublishers();
                String message = util.ValidAccessToken(voRequestGetPublishers.AccessToken, voRequestGetPublishers.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<Publisher> publishers = users.GetPublishers();
                    List<VOPublisher> voPublishers = PublisherToVOPublisherConverter.Convert(publishers);
                    response.voUsers = voPublishers;
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
        
        /// <summary>
        /// Approve publishers and sends emails to each one of them
        /// </summary>
        /// <param name="voPublishers"></param>
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
                    User user;
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    foreach (var mail in voPublishers.Mails)
                    {                        
                        user = users.Find(mail);
                        keyValuePairs[ParamCodes.USER_NAME] = user.Name;
                        keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                        EmailDataGeneric mailData = emailUtil.GetFormatMailUsers(EmailFormatCodes.CODE_APPROVE_PUBLISHER, user.LanguageCode, keyValuePairs);
                        emailUtil.SendEmailAsync(mail, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Returns admin user and their tokens
        /// </summary>
        /// <param name="mail"></param>
        /// <param name="password"></param>
        /// <returns> User data and their tokens</returns>
        public VOResponseAdminLogin GetAdmin(string mail, string password)
        {
            VOResponseAdminLogin result = new VOResponseAdminLogin();
            try
            {
                String message;
                bool adminMailExists = AdminExists(mail);
                if (adminMailExists == true)                
                {
                    Admin usr = users.GetAdmin(mail, password);
                    PasswordHasher passwordHasher = new PasswordHasher();
                    if (usr != null && passwordHasher.VerifyHashedPassword(usr.Password, password))
                    {
                        Tokens voTokens = users.CreateTokens(mail);
                        result.voAdmin = new VOAdmin(usr.Mail, null, usr.Name, usr.LastName, usr.Phone);
                        result.RefreshToken = voTokens.RefreshToken;
                        result.AccessToken = voTokens.AccessToken;
                        message = EnumMessages.SUCC_USRLOGSUCCESS.ToString();
                    }
                    else
                    {
                        message = EnumMessages.ERR_USRWRONGPASS.ToString();
                    }
                }
                else
                {
                    message = EnumMessages.ERR_USRMAILNOTEXIST.ToString();
                }
                result.responseCode = message;
                return result;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Updates a customer who wants to be a publisher
        /// </summary>
        /// <param name="voRequestRequestPublisher"></param>
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

        /// <summary>
        /// Returns space types
        /// </summary>
        /// <returns> Space types</returns>
        public List<VOSpaceType> GetSpaceTypes()
        {
            List<VOSpaceType> voSpaceTypes;
            try
            {
                List<SpaceType> spaceTypes = spaces.GetSpaceTypes();
                voSpaceTypes = SpaceTypeToVOSpaceTypeConverter.Convert(spaceTypes);
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return voSpaceTypes;
        }        

        /// <summary>
        /// Creates tokens for an user
        /// </summary>
        /// <param name="mail"></param>
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

        /// <summary>
        /// Creates a new temporal password and sends it to the user
        /// </summary>
        /// <param name="voPasswordRecovery"></param>
        public VOResponsePasswordRecovery RecoverPassword(VORequestPasswordRecovery voPasswordRecovery)
        {
            VOResponsePasswordRecovery result = new VOResponsePasswordRecovery();
            String message;
            try
            {
                bool userExists = UserExists(voPasswordRecovery.Mail);
                if (userExists)
                {
                    string randomPassword = users.UpdatePassword(voPasswordRecovery.Mail);
                    User user = users.Find(voPasswordRecovery.Mail);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = user.Name;
                    keyValuePairs[ParamCodes.LOGIN_LINK] = ConfigurationManager.AppSettings["LOGIN_LINK"];
                    keyValuePairs[ParamCodes.TEMP_PASSWORD] = randomPassword;
                    EmailDataGeneric mailData = emailUtil.GetFormatMailUsers(EmailFormatCodes.CODE_PASSWORD_RESETED, user.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(voPasswordRecovery.Mail, mailData.Body, mailData.Subject);
                    message = EnumMessages.SUCC_PASSWORDUPDATED.ToString();
                }
                else
                {
                    message = EnumMessages.ERR_USRMAILNOTEXIST.ToString();
                }
                result.responseCode = message;
                return result;

            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Validate email from an activation link
        /// </summary>
        /// <param name="voValidateEmail"></param>
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

        /// <summary>
        /// Updates user info (used by admin)
        /// </summary>
        /// <param name="voRequestUpdate"></param>
        public string UpdateUserAdmin(VORequestUpdateUserAdmin voRequestUpdate)
        {
            VOResponseUpdateUserAdmin voResp = new VOResponseUpdateUserAdmin();
            String message;
            try
            {
                message = util.ValidAccessToken(voRequestUpdate.AccessToken, voRequestUpdate.AdminMail);
                if (!voRequestUpdate.OriginalMail.Equals(voRequestUpdate.Mail))
                {
                    if (users.Member(voRequestUpdate.Mail))
                    {
                        message = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                    }
                }
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    users.UpdateUserAdmin(voRequestUpdate.Mail, voRequestUpdate.Name, voRequestUpdate.LastName, voRequestUpdate.Phone, voRequestUpdate.CheckPublisher,
                        voRequestUpdate.Rut, voRequestUpdate.RazonSocial, voRequestUpdate.Address, voRequestUpdate.MailValidated, voRequestUpdate.PublisherValidated, voRequestUpdate.Active);

                }
                return message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Get all users (publisher and customers)
        /// </summary>
        /// <param name="voRequest"></param>
        /// <returns> All users created</returns>
        public VOResponseGetUsers GetUsers(VORequestGetUsers voRequest)
        {
            VOResponseGetUsers response = new VOResponseGetUsers();
            try
            {
                String message = util.ValidAccessToken(voRequest.AccessToken, voRequest.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<Publisher> usersList = users.GetUsers();
                    List<VOPublisher> voUsers = PublisherToVOPublisherConverter.Convert(usersList);                    
                    response.voUsers = voUsers;
                }
                response.responseCode = message;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        /// <summary>
        /// Return user data from a particular user
        /// </summary>
        /// <param name="voRequestUserData"></param>
        /// <returns> User data</returns>
        public VOResponseGetUserData GetUserData(VORequestGetUserData voRequestUserData)
        {
            VOResponseGetUserData response = new VOResponseGetUserData();
            try
            {
                string message;
                Publisher usr = users.GetUserData(voRequestUserData.AccessToken);
                if (usr != null)
                {
                    message = EnumMessages.SUCC_USERSOK.ToString();
                    VOPublisher voPublisher = PublisherToVOPublisherConverter.Convert(usr);
                    response.User = voPublisher;
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

        /// <summary>
        /// Update tokens from user
        /// </summary>
        /// <param name="voTokensUpdate"></param>
        /// <returns> Tokens </returns>
        public VOResponseTokensUpdate UpdateTokens(VORequestTokensUpdate voTokensUpdate)
        {
            VOResponseTokensUpdate response = new VOResponseTokensUpdate();
            try
            {
                String message = util.ValidRefreshToken(voTokensUpdate.RefreshToken, voTokensUpdate.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    Tokens tokens = users.CreateTokens(voTokensUpdate.Mail);
                    response.RefreshToken = tokens.RefreshToken;
                    response.AccessToken = tokens.AccessToken;
                    User user = users.Find(voTokensUpdate.Mail);
                    VOUser vouser = UserToVOUserConverter.Convert(user);
                    response.User = vouser;
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

        /// <summary>
        /// Get facilities
        /// </summary>
        /// <returns> Facilities </returns>
        public VOResponseGetFacilities GetFacilities()
        {
            VOResponseGetFacilities response = new VOResponseGetFacilities();
            List<VOFacility> voFacilities;
            try
            {
                List<Facility> facilities = spaces.GetFacilities();
                voFacilities = FacilityToVOFacilityConverter.Convert(facilities);
                response.facilities = voFacilities;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        /// <summary>
        /// Creates a new publication and send mail to publisher and admin
        /// </summary>
        /// <param name="voCreatePublication"></param>
        public async Task<VOResponseCreatePublication> CreatePublication(VORequestCreatePublication voCreatePublication)
        {
            VOResponseCreatePublication response = new VOResponseCreatePublication();
            try
            {
                String message = util.ValidAccessToken(voCreatePublication.AccessToken, voCreatePublication.VOPublication.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    Dictionary<string, string> publicationInfo;
                    EmailDataGeneric mailData;                   
                    User user = users.Find(voCreatePublication.VOPublication.Mail);
                    Publication publication = VOPublicationToPublicationConverter.Convert(voCreatePublication.VOPublication, voCreatePublication.Images);
                    List<Image> images = VOImageToImageConverter.Convert(voCreatePublication.Images);
                    publicationInfo = await spaces.CreatePublicationAsync(publication, user, images, voCreatePublication.ImagesURL);
                    string publicationPlan = spaces.GetPublicationPlanById(voCreatePublication.VOPublication.IdPlan);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = user.Name;
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = voCreatePublication.VOPublication.Title;
                    keyValuePairs[ParamCodes.DATE_TO] = publicationInfo[ParamCodes.DATE_TO];
                    keyValuePairs[ParamCodes.AVAILABILITY] = voCreatePublication.VOPublication.Availability;
                    keyValuePairs[ParamCodes.PREFERENTIAL_PLAN] = publicationPlan;
                    keyValuePairs[ParamCodes.PRICE] = publicationInfo[ParamCodes.PRICE];
                    // Send email to publisher
                    mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_CREATED, user.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(voCreatePublication.VOPublication.Mail, mailData.Body, mailData.Subject);
                    // Send email to admin
                    string mailAdmin = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                    keyValuePairs[ParamCodes.PUBLISHER_EMAIL] = voCreatePublication.VOPublication.Mail;
                    mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_CREATED_ADMIN, user.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(mailAdmin, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Returns publication that hasnt been approved yet
        /// </summary>
        /// <param name="voPublicationPendingApproval"></param>
        /// <returns>Publications pending approval </returns>
        public VOResponsePublicationPendingApproval GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval)
        {
            VOResponsePublicationPendingApproval response = new VOResponsePublicationPendingApproval();
            try
            {
                String message = util.ValidAccessToken(voPublicationPendingApproval.AccessToken, voPublicationPendingApproval.AdminMail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<Publication> publications = spaces.GetPublicationsPendingApproval();
                    List<VOPublication> voPublications = PublicationToVOPublicationConverter.Convert(publications);
                    response.Publications = voPublications;
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

        /// <summary>
        /// Returns spaces from a publisher
        /// </summary>
        /// <param name="voRequestGetPublisherSpaces"></param>
        /// <returns> Publisher's spaces</returns>
        public VOResponseGetPublisherSpaces GetPublisherSpaces(VORequestGetPublisherSpaces voRequestGetPublisherSpaces)
        {
            VOResponseGetPublisherSpaces response = new VOResponseGetPublisherSpaces();
            List<VOPublication> voPublications;
            try
            {
                String message = util.ValidAccessToken(voRequestGetPublisherSpaces.AccessToken, voRequestGetPublisherSpaces.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<Publication> publications = spaces.GetPublisherSpaces(voRequestGetPublisherSpaces.Mail);
                    voPublications = PublicationToVOPublicationConverter.Convert(publications);
                    response.Publications = voPublications;
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

        /// <summary>
        /// Returns a publication by an idPublication
        /// </summary>
        /// <param name="idPublication"></param>
        /// <param name="mail"></param>
        /// <returns> Publication </returns>
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
                Publication publication = spaces.GetSpace(idPublication, user, true);

                if (publication != null)
                {
                    if (mail != null)
                    {
                        isFavorite = spaces.IsFavourite(idPublication, user.IdUser);
                    }
                    List<Publication> related = spaces.GetRelatedSpaces(idPublication, publication.Capacity, publication.SpaceType, publication.City);
                    response.Publication = PublicationToVOPublicationConverter.Convert(publication);
                    response.Favorite = isFavorite;
                    response.RelatedPublications = PublicationToVOPublicationConverter.Convert(related);
                    List<PublicationQuestion> questions = spaces.GetPublicationQuestions(idPublication);
                    response.Questions = QuestionToVOQuestionConverter.Convert(questions);
                    List<Publication> otherPublications = spaces.GetOtherPublicationConfig(idPublication);
                    response.OtherPublicationConfig = PublicationToVOPublicationConverter.Convert(otherPublications);
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

        /// <summary>
        /// Updates the state from a publication and sends email to publisher
        /// </summary>
        /// <param name="voUpdateStatePublication"></param>
        public VOResponseUpdateStatePublication UpdateStatePublication(VORequestUpdateStatePublication voUpdateStatePublication)
        {
            VOResponseUpdateStatePublication response = new VOResponseUpdateStatePublication();
            bool isAdmin = false;
            try
            {
                String message = util.ValidAccessToken(voUpdateStatePublication.AccessToken, voUpdateStatePublication.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    if (users.AdminMember(voUpdateStatePublication.Mail))
                    {
                        isAdmin = true;
                    }
                    int oldCodeState = util.ConvertStatePublication(voUpdateStatePublication.OldState);
                    int newCodeState = util.ConvertStatePublication(voUpdateStatePublication.NewState);
                    Publication publisherData = spaces.UpdateStatePublication(voUpdateStatePublication.IdPublication, voUpdateStatePublication.RejectedReason, newCodeState, isAdmin);
                    message = EnumMessages.SUCC_PUBLICATIONUPDATED.ToString();
                    if (publisherData != null) {
                        Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                        EmailDataGeneric mailData;
                        User user = users.Find(publisherData.Mail);
                        keyValuePairs[ParamCodes.USER_NAME] = publisherData.NamePublisher;
                        keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publisherData.Title;
                        if (newCodeState == PUBLICATION_APPROVED) {
                            mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_APPROVED, user.LanguageCode, keyValuePairs);
                            emailUtil.SendEmailAsync(user.Mail, mailData.Body, mailData.Subject);                                
                        } else if (newCodeState == PUBLICATION_REJECTED) {
                            keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                            keyValuePairs[ParamCodes.REJECTED_REASON] = voUpdateStatePublication.RejectedReason;                                
                            mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_REJECTED, user.LanguageCode, keyValuePairs);
                            emailUtil.SendEmailAsync(user.Mail, mailData.Body, mailData.Subject);
                        }
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

        /// <summary>
        /// Returns publications that match certain criteria
        /// </summary>
        /// <param name="voGetPublicationsFilter"></param>
        /// <returns> Publication </returns>
        public VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter)
        {
            {
                VOResponseGetPublicationsWithFilters response = new VOResponseGetPublicationsWithFilters();
                try
                {
                    Tuple<List<Publication>, int> result = spaces.GetPublicationsWithFilters(voGetPublicationsFilter.SpaceType, voGetPublicationsFilter.Capacity, voGetPublicationsFilter.Facilities,
                        voGetPublicationsFilter.City, voGetPublicationsFilter.PageNumber, voGetPublicationsFilter.State, voGetPublicationsFilter.PublicationsPerPage);
                    List<VOPublication> publications = PublicationToVOPublicationConverter.Convert(result.Item1);
                    response.Publications = publications;
                    response.TotalPublications = result.Item2;
                }
                catch (GeneralException e)
                {
                    throw e;
                }
                response.responseCode = EnumMessages.SUCC_PUBLICATIONSOK.ToString();
                return response;

            }

        }

        /// <summary>
        /// Add or remove from favorites
        /// </summary>
        /// <param name="voUpdateFavorite"></param>
        public VOResponseUpdateFavorite UpdateFavorite(VORequestUpdateFavorite voUpdateFavorite)
        {
            try
            {
                VOResponseUpdateFavorite response = new VOResponseUpdateFavorite();
                String message = util.ValidAccessToken(voUpdateFavorite.AccessToken, voUpdateFavorite.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voUpdateFavorite.Mail);
                    spaces.UpdateFavorite(voUpdateFavorite.Code, voUpdateFavorite.IdPublication, user.IdUser);
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

        /// <summary>
        /// Updates a publication and sends email to publisher and admin
        /// </summary>
        /// <param name="voUpdatePublication"></param>
        public async Task<VOResponseUpdatePublication> UpdatePublication(VORequestUpdatePublication voUpdatePublication)
        {
            try
            {
                VOResponseUpdatePublication response = new VOResponseUpdatePublication();
                String message = util.ValidAccessToken(voUpdatePublication.AccessToken, voUpdatePublication.Publication.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    Dictionary<string, string> publicationInfo;
                    User user = users.Find(voUpdatePublication.Publication.Mail);
                    Publication publication = VOPublicationToPublicationConverter.Convert(voUpdatePublication.Publication, voUpdatePublication.Base64Images);
                    List<Image> images = VOImageToImageConverter.Convert(voUpdatePublication.Base64Images);
                    publicationInfo = await spaces.UpdatePublication(publication, images, voUpdatePublication.ImagesURL, user);
                    User publisher = spaces.GetPublisherByPublication(voUpdatePublication.Publication.IdPublication);                    
                    //Send email to publisher
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = publisher.Name;
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = voUpdatePublication.Publication.Title;
                    keyValuePairs[ParamCodes.DATE_TO] = publicationInfo[ParamCodes.DATE_TO];
                    keyValuePairs[ParamCodes.AVAILABILITY] = publicationInfo[ParamCodes.AVAILABILITY];
                    keyValuePairs[ParamCodes.PREFERENTIAL_PLAN] = publicationInfo[ParamCodes.PREFERENTIAL_PLAN];
                    keyValuePairs[ParamCodes.PRICE] = publicationInfo[ParamCodes.PRICE];
                    EmailDataGeneric mailDataPublisher = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_MODIFIED_ADMIN, publisher.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(publisher.Mail, mailDataPublisher.Body, mailDataPublisher.Subject);                    
                    //Send email to admin                    
                    keyValuePairs[ParamCodes.PUBLISHER_EMAIL] = user.Mail;
                    string mailAdmin = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                    EmailDataGeneric mailDataAdmin = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_MODIFIED, publisher.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(mailAdmin, mailDataAdmin.Body, mailDataAdmin.Subject);
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

        /// <summary>
        /// Create a reservation and sends email to publisher and customer, and sends notification to devices
        /// </summary>
        /// <param name="voCreateReservation"></param>
        public VOResponseCreateReservation CreateReservation(VORequestCreateReservation voCreateReservation)
        {
            VOResponseCreateReservation response = new VOResponseCreateReservation();
            try
            {                
                String message = util.ValidAccessToken(voCreateReservation.AccessToken, voCreateReservation.VOReservation.MailCustomer);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreateReservation.VOReservation.MailCustomer);
                    int idPlan = spaces.GetReservationPlanByDescription(voCreateReservation.VOReservation.PlanSelected);
                    Reservation reservation = VOReservationToReservationConverter.Convert(voCreateReservation.VOReservation);
                    spaces.CreateReservation(reservation, user, idPlan);
                    int reservedQuantity;
                    if (voCreateReservation.VOReservation.HourFrom != null && voCreateReservation.VOReservation.HourTo != null)
                    {
                        reservedQuantity = Convert.ToInt32(voCreateReservation.VOReservation.HourTo) - Convert.ToInt32(voCreateReservation.VOReservation.HourFrom);
                    } else
                    {
                        reservedQuantity = voCreateReservation.VOReservation.ReservedQuantity;
                    }
                    bool plural = reservedQuantity > 1;
                    string descriptionReservationPlan = spaces.GetReservationPlanDescriptionEmail(idPlan, user.LanguageCode, plural);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    //Send mail to publisher
                    User publisher = spaces.GetPublisherByPublication(voCreateReservation.VOReservation.IdPublication);
                    keyValuePairs[ParamCodes.USER_NAME] = publisher.Name;
                    VOResponseGetSpace publication = GetSpace(voCreateReservation.VOReservation.IdPublication, voCreateReservation.VOReservation.MailCustomer);
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publication.Publication.Title;
                    string comment = String.IsNullOrEmpty(voCreateReservation.VOReservation.Comment) ? "-" : voCreateReservation.VOReservation.Comment;
                    keyValuePairs[ParamCodes.COMMENT] = voCreateReservation.VOReservation.Comment;
                    EmailDataGeneric mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_RESERVATION_CREATED_PUBLISHER, publisher.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(publisher.Mail, mailData.Body, mailData.Subject);
                    //Send mail to customer
                    keyValuePairs[ParamCodes.USER_NAME] = user.Name;
                    String dateFromString = Util.ConvertDateToString(voCreateReservation.VOReservation.DateFrom);
                    keyValuePairs[ParamCodes.DATE_FROM] = dateFromString;             
                    keyValuePairs[ParamCodes.RESERVED_QUANTITY] = reservedQuantity.ToString();
                    keyValuePairs[ParamCodes.RESERVATION_PLAN] = descriptionReservationPlan;
                    keyValuePairs[ParamCodes.QUANTITY_PEOPLE] = voCreateReservation.VOReservation.People.ToString();
                    keyValuePairs[ParamCodes.PRICE] = voCreateReservation.VOReservation.TotalPrice.ToString();
                    EmailDataGeneric mailDataReservation = emailUtil.GetFormatMailReservations(EmailFormatCodes.CODE_RESERVATION_CREATED_CUSTOMER, publisher.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(voCreateReservation.VOReservation.MailCustomer, mailDataReservation.Body, mailDataReservation.Subject);
                    //Send notification to mobile device
                    EmailDataGeneric notificationData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_NOTIF_NEW_RESERVATION, publisher.LanguageCode, keyValuePairs);
                    String deviceToken = users.GetDeviceToken(publisher.Mail);
                    if (deviceToken != null)
                    {
                        PushNotification pushNotif = new PushNotification();
                        pushNotif.Send(deviceToken, notificationData.Subject, notificationData.Body);
                    }
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

        /// <summary>
        /// Returns all reservations from customer
        /// </summary>
        /// <param name="voGetReservationsCustomer"></param>
        /// <returns> Reservations </returns>
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
                        List<ReservationExtended> reservations = spaces.GetReservationsCustomer(voGetReservationsCustomer.Mail, user.IdUser);
                        response.Reservations = ReservationExtendedToVOReservationExtendedConverter.Convert(reservations);
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

        /// <summary>
        /// Returns reserved publications from a publisher
        /// </summary>
        /// <param name="voGetReservationsPublisher"></param>
        /// <returns> Reservations </returns>
        public VOResponseGetReservationsPublisher GetReservationsPublisher(VORequestGetReservationsPublisher voGetReservationsPublisher)
        {
            VOResponseGetReservationsPublisher response = new VOResponseGetReservationsPublisher();
            try
            {
                String message = util.ValidAccessToken(voGetReservationsPublisher.AccessToken, voGetReservationsPublisher.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voGetReservationsPublisher.Mail);
                    List<ReservationExtended> reservations = spaces.GetReservationsPublisher(user.IdUser);
                    response.Reservations = ReservationExtendedToVOReservationExtendedConverter.Convert(reservations);
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

        /// <summary>
        /// Udpates state from a reservation and sends mail to customer.
        /// If the update was made by the admin, sends email to publisher as well
        /// </summary>
        /// <param name="voUpdateStateReservation"></param>
        public VOResponseUpdateStateReservation UpdateStateReservation(VORequestUpdateStateReservation voUpdateStateReservation)
        {
            VOResponseUpdateStateReservation response = new VOResponseUpdateStateReservation();
            bool isAdmin;
            try
            {
                String message = util.ValidAccessToken(voUpdateStateReservation.AccessToken, voUpdateStateReservation.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    int oldCodeRservation = util.ConvertStateReservation(voUpdateStateReservation.OldState);
                    int newCodeReservation = util.ConvertStateReservation(voUpdateStateReservation.NewState);
                    UsersReservationBasicData usersData = spaces.UpdateStateReservation(voUpdateStateReservation.IdReservation, voUpdateStateReservation.CanceledReason, newCodeReservation, voUpdateStateReservation.NewState, voUpdateStateReservation.DateTo);
                    EmailDataGeneric mailData;
                    isAdmin = users.AdminMember(voUpdateStateReservation.Mail);
                    string publicationTitle = spaces.GetPublicationTitleByReservationId(voUpdateStateReservation.IdReservation);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    if (newCodeReservation == RESERVATION_RESERVED_STATE)
                    {
                        //Send mail to customer
                        keyValuePairs[ParamCodes.USER_NAME] = usersData.CustomerName;
                        keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publicationTitle;
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_RESERVATION_CONFIRMED_CUSTOMER, usersData.CustomerLanguage, keyValuePairs);
                        emailUtil.SendEmailAsync(usersData.CustomerMail, mailData.Body, mailData.Subject);
                    }
                    else if (newCodeReservation == RESERVATION_CANCELED_STATE)
                    {
                        keyValuePairs[ParamCodes.REJECTED_REASON] = voUpdateStateReservation.CanceledReason;
                        keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publicationTitle;
                        //Send mail to customer
                        keyValuePairs[ParamCodes.USER_NAME] = usersData.CustomerName;
                        keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                        mailData = emailUtil.GetFormatMailReservations(EmailFormatCodes.CODE_RESERVATION_CANCELLED_CUSTOMER, usersData.CustomerLanguage, keyValuePairs);
                        emailUtil.SendEmailAsync(usersData.CustomerMail, mailData.Body, mailData.Subject);
                        if (isAdmin)
                        {
                            //Send mail to publisher
                            keyValuePairs[ParamCodes.USER_NAME] = usersData.PublisherName;
                            mailData = emailUtil.GetFormatMailReservations(EmailFormatCodes.CODE_RESERVATION_CANCELLED_PUBLISHER, usersData.PublisherLanguage, keyValuePairs);
                            emailUtil.SendEmailAsync(usersData.PublisherMail, mailData.Body, mailData.Subject);
                        }

                    }
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

        /// <summary>
        /// Updates reservation data and sends email to customer and publisher
        /// </summary>
        /// <param name="voUpdateReservation"></param>
        public VOResponseUpdateReservation UpdateReservation(VORequestUpdateReservation voUpdateReservation)
        {
            try
            {
                VOResponseUpdateReservation response = new VOResponseUpdateReservation();
                String message = util.ValidAccessToken(voUpdateReservation.AccessToken, voUpdateReservation.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    UsersReservationBasicData usersData = spaces.UpdateReservation(voUpdateReservation.IdReservation, voUpdateReservation.DateFrom, voUpdateReservation.HourFrom,
                        voUpdateReservation.HourTo, voUpdateReservation.TotalPrice, voUpdateReservation.People, voUpdateReservation.ReservedQuantity);
                    EmailDataGeneric mailData;
                    string publicationTitle = spaces.GetPublicationTitleByReservationId(voUpdateReservation.IdReservation);
                    int reservedQuantity;
                    if (voUpdateReservation.HourFrom != null && voUpdateReservation.HourTo != null)
                    {
                        reservedQuantity = Convert.ToInt32(voUpdateReservation.HourTo) - Convert.ToInt32(voUpdateReservation.HourFrom);
                    }
                    else
                    {
                        reservedQuantity = voUpdateReservation.ReservedQuantity;
                    }
                    bool plural = reservedQuantity > 1;
                    string descriptionReservationPlan = spaces.GetReservationPlanDescriptionEmail(usersData.IdPlan, usersData.CustomerLanguage, plural);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = usersData.CustomerName;
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publicationTitle;
                    String dateFromString = Util.ConvertDateToString(voUpdateReservation.DateFrom);
                    keyValuePairs[ParamCodes.DATE_FROM] = dateFromString;
                    keyValuePairs[ParamCodes.QUANTITY_PEOPLE] = voUpdateReservation.People.ToString();
                    keyValuePairs[ParamCodes.PRICE] = voUpdateReservation.TotalPrice.ToString();
                    keyValuePairs[ParamCodes.RESERVATION_PLAN] = descriptionReservationPlan;
                    keyValuePairs[ParamCodes.RESERVED_QUANTITY] = reservedQuantity.ToString();
                    //Send mail to customer
                    mailData = emailUtil.GetFormatMailReservations(EmailFormatCodes.CODE_RESERVATION_MODIFIED_CUSTOMER, usersData.CustomerLanguage, keyValuePairs);
                    emailUtil.SendEmailAsync(usersData.CustomerMail, mailData.Body, mailData.Subject);
                    //Send mail to publisher
                    mailData = emailUtil.GetFormatMailReservations(EmailFormatCodes.CODE_RESERVATION_MODIFIED_PUBLISHER, usersData.PublisherLanguage, keyValuePairs);
                    emailUtil.SendEmailAsync(usersData.PublisherMail, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Creates a review
        /// </summary>
        /// <param name="voCreateReview"></param>
        public VOResponseCreateReview CreateReview(VORequestCreateReview voCreateReview)
        {
            try
            {
                VOResponseCreateReview response = new VOResponseCreateReview();
                String message = util.ValidAccessToken(voCreateReview.AccessToken, voCreateReview.VOReview.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreateReview.VOReview.Mail);
                    Review review = VOReviewToReviewConverter.Convert(voCreateReview.VOReview);
                    //ML
                    
                    string mlValue = ConfigurationManager.AppSettings["ML_ACTIVE"];
                    bool useML = mlValue.Equals("1") ? true : false;
                    if (useML)
                    {
                        int rating = CalculateRatingML(review.ReviewDescription);
                        review.Rating = rating;
                    }
                    spaces.CreateReview(review, user.IdUser);
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

        private int CalculateRatingML(string review)
        {
            // Add input data
            var input = new ModelInput();
            input.SentimentText = review;

            // Load model and predict output of sample data
            double percentage = CalculatePercentage(ConsumeModel.Predict(input).Score);
            int rating = Util.CalculateRating(percentage);
            return rating;
        }

        private float CalculatePercentage(double value)
        {
            return 100 * (1.0f / (1.0f + (float)Math.Exp(-value)));
        }
        /// <summary>
        /// Creates a question to a publication and sends email to publisher
        /// </summary>
        /// <param name="voCreatePublicationQuestion"></param>
        public VOResponseCreatePublicationQuestion CreatePublicationQuestion(VORequestCreatePublicationQuestion voCreatePublicationQuestion)
        {
            try
            {
                VOResponseCreatePublicationQuestion response = new VOResponseCreatePublicationQuestion();
                String message = util.ValidAccessToken(voCreatePublicationQuestion.AccessToken, voCreatePublicationQuestion.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User user = users.Find(voCreatePublicationQuestion.Mail);
                    spaces.CreatePublicationQuestion(voCreatePublicationQuestion.IdPublication, voCreatePublicationQuestion.Question, user.IdUser);
                    User publisher = spaces.GetPublisherByPublication(voCreatePublicationQuestion.IdPublication);
                    VOResponseGetSpace publication = GetSpace(voCreatePublicationQuestion.IdPublication, voCreatePublicationQuestion.Mail);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = publisher.Name;
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publication.Publication.Title;
                    keyValuePairs[ParamCodes.QUESTION] = voCreatePublicationQuestion.Question;
                    EmailDataGeneric mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_NEW_QUESTION, publisher.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(publisher.Mail, mailData.Body, mailData.Subject);
                    //Send notification to mobile device
                    EmailDataGeneric notificationData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_NOTIF_NEW_QUESTION, publisher.LanguageCode, keyValuePairs);
                    String deviceToken = users.GetDeviceToken(publisher.Mail);
                    if (deviceToken != null)
                    {
                        PushNotification pushNotif = new PushNotification();
                        pushNotif.Send(deviceToken, notificationData.Subject, notificationData.Body);
                    }
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

        /// <summary>
        /// Creates an answer to a publication and sends email to customer
        /// </summary>
        /// <param name="voCreatePublicationAnswer"></param>
        public VOResponseCreatePublicationAnswer CreatePublicationAnswer(VORequestCreatePublicationAnswer voCreatePublicationAnswer)
        {
            try
            {
                VOResponseCreatePublicationAnswer response = new VOResponseCreatePublicationAnswer();
                String message = util.ValidAccessToken(voCreatePublicationAnswer.AccessToken, voCreatePublicationAnswer.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User customer = spaces.CreatePublicationAnswer(voCreatePublicationAnswer.IdQuestion, voCreatePublicationAnswer.Answer);
                    String publicationTitle = spaces.GetPublicationTitleByQuestionId(voCreatePublicationAnswer.IdQuestion);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = customer.Name;
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publicationTitle;
                    keyValuePairs[ParamCodes.ANSWER] = voCreatePublicationAnswer.Answer;
                    EmailDataGeneric mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PUBLICATION_NEW_ANSWER, customer.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(customer.Mail, mailData.Body, mailData.Subject);
                    //Send notification to mobile device
                    EmailDataGeneric notificationData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_NOTIF_NEW_ANSWER, customer.LanguageCode, keyValuePairs);
                    String deviceToken = users.GetDeviceToken(customer.Mail);
                    if (deviceToken != null)
                    {
                        PushNotification pushNotif = new PushNotification();
                        pushNotif.Send(deviceToken, notificationData.Subject, notificationData.Body);
                    }
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

        /// <summary>
        /// Returns all publication plans
        /// </summary>
        /// <returns> Publication plans options </returns>
        public VOResponseGetPublicationPlans GetPublicationPlans()
        {
            VOResponseGetPublicationPlans response = new VOResponseGetPublicationPlans();
            List<VOPublicationPlan> voPlans;
            try
            {
                List<PublicationPlan> plans = spaces.GetPublicationPlans();
                voPlans = PublicationPlanToVOPublicationPlanConverter.Convert(plans);
                response.Plans = voPlans;
            }
            catch (GeneralException e)
            {
                throw e;
            }
            return response;
        }

        /// <summary>
        /// Updates preferential plan payment and sends mail to admin
        /// </summary>
        /// <param name="voUpdatePayment"></param>
        public async Task<VOResponseUpdatePreferentialPayment> UpdatePreferentialPayment(VORequestUpdatePreferentialPayment voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePreferentialPayment response = new VOResponseUpdatePreferentialPayment();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    Image evidence = VOImageToImageConverter.Convert(voUpdatePayment.Evidence);
                    await spaces.UpdatePreferentialPayment(voUpdatePayment.IdPublication, voUpdatePayment.Comment, evidence);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.PUBLISHER_EMAIL] = voUpdatePayment.Mail;
                    string mailAdmin = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                    User admin = users.Find(mailAdmin);
                    EmailDataGeneric mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_PREFERENTIAL_PLAN, admin.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(mailAdmin, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Updates reservation payment and sends to publisher
        /// </summary>
        /// <param name="voPayReservationCustomer"></param>
        public async Task<VOResponsePayReservationCustomer> PayReservationCustomer(VORequestPayReservationCustomer voPayReservationCustomer)
        {
            try
            {
                VOResponsePayReservationCustomer response = new VOResponsePayReservationCustomer();
                String message = util.ValidAccessToken(voPayReservationCustomer.AccessToken, voPayReservationCustomer.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    Image evidence = VOImageToImageConverter.Convert(voPayReservationCustomer.Evidence);
                    User user = users.Find(voPayReservationCustomer.Mail);
                    UserBasicData publisher = await spaces.PayReservationCustomer(voPayReservationCustomer.IdReservation, voPayReservationCustomer.Comment, evidence, user.IdUser);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();                    
                    string publicationTitle = spaces.GetPublicationTitleByReservationId(voPayReservationCustomer.IdReservation);
                    keyValuePairs[ParamCodes.USER_NAME] = publisher.Name;
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publicationTitle;
                    EmailDataGeneric mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_RESERVATION_PAID, publisher.Language, keyValuePairs);
                    emailUtil.SendEmailAsync(publisher.Mail, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Updates commission payment and sends email to admin
        /// </summary>
        /// <param name="voPayReservationPublisher"></param>
        public async Task<VOResponsePayReservationPublisher> PayReservationPublisher(VORequestPayReservationPublisher voPayReservationPublisher)
        {
            VOResponsePayReservationPublisher response = new VOResponsePayReservationPublisher();
            try
            {                
                String message = util.ValidAccessToken(voPayReservationPublisher.AccessToken, voPayReservationPublisher.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    Image evidence = VOImageToImageConverter.Convert(voPayReservationPublisher.Evidence);
                    User user = users.Find(voPayReservationPublisher.Mail);
                    await spaces.PayReservationPublisher(voPayReservationPublisher.IdReservation, voPayReservationPublisher.Comment, evidence, user.IdUser);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.PUBLISHER_EMAIL] = voPayReservationPublisher.Mail;
                    string mailAdmin = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
                    User admin = users.Find(mailAdmin);
                    EmailDataGeneric mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_COMMISSION, admin.LanguageCode, keyValuePairs);
                    emailUtil.SendEmailAsync(mailAdmin, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Confirm reservation payment and sends email to customer 
        /// </summary>
        /// <param name="voUpdatePayment"></param>
        public VOResponseUpdatePaymentCustomer UpdatePaymentCustomer(VORequestUpdatePaymentCustomer voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePaymentCustomer response = new VOResponseUpdatePaymentCustomer();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    UserBasicData customer = spaces.UpdatePaymentCustomer(voUpdatePayment.IdReservation, voUpdatePayment.Approved, voUpdatePayment.RejectedReason);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = customer.Name;
                    String title = spaces.GetPublicationTitleByReservationId(voUpdatePayment.IdReservation);
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = title;
                    EmailDataGeneric mailData;
                    if (voUpdatePayment.Approved)
                    {
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_RESERVATION_APPROVED, customer.Language, keyValuePairs);
                    }
                    else
                    {
                        keyValuePairs[ParamCodes.REJECTED_REASON] = voUpdatePayment.RejectedReason;
                        keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_RESERVATION_REJECTED, customer.Language, keyValuePairs);
                    }
                    emailUtil.SendEmailAsync(customer.Mail, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Returns publication plans with theirs prices
        /// </summary>
        /// <param name="voGetPayment"></param>
        /// <returns> Publications plans</returns>
        public VOResponseGetPublicationPlanPayments GetPublicationPlanPayments(VORequestGetPublicationPlanPayments voGetPayment)
        {
            VOResponseGetPublicationPlanPayments response = new VOResponseGetPublicationPlanPayments();
            try
            {
                String message = util.ValidAccessToken(voGetPayment.AccessToken, voGetPayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<PublicationPaymentAdmin> payments = spaces.GetPublicationPlanPayments();
                    List<VOPublicationPaymentAdmin> voPyaments = PublicationPayAdminToVOPublicationPayAdminConverter.Convert(payments);
                    response.Payments = voPyaments;
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

        /// <summary>
        /// Returnes all commissions payments
        /// </summary>
        /// <param name="voGetPayment"></param>
        /// <returns> Commissions payments </returns>
        public VOResponseGetCommissionPayments GetCommissionPayments(VORequestGetCommissionPayments voGetPayment)
        {
            VOResponseGetCommissionPayments response = new VOResponseGetCommissionPayments();
            try
            {
                String message = util.ValidAccessToken(voGetPayment.AccessToken, voGetPayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<CommissionPaymentAdmin> commissions = spaces.GetCommissionPaymentsAdmin();
                    List<VOCommissionPaymentAdmin> voCommissions = CommissionPayAdminToVOCommissionPayAdminConverter.Convert(commissions);
                    response.Commissions = voCommissions;
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

        /// <summary>
        /// Returns favorites from an user
        /// </summary>
        /// <param name="voGetFavorite"></param>
        /// <returns> Favorites </returns>
        public VOResponseGetFavorites GetFavorites(VORequestGetFavorite voGetFavorite)
        {
            VOResponseGetFavorites response = new VOResponseGetFavorites();
            try
            {
                String message = util.ValidAccessToken(voGetFavorite.AccessToken, voGetFavorite.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    User usr = users.Find(voGetFavorite.Mail);
                    List<Publication> favourites = spaces.GetFavorites(usr.IdUser);
                    List<VOPublication> voFavourites = PublicationToVOPublicationConverter.Convert(favourites);
                    response.Publications = voFavourites;
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

        /// <summary>
        /// Returns recommendes publications
        /// </summary>
        /// <returns> Recommended publications </returns>
        public VOResponseGetRecommendedPublications GetRecommendedPublications()
        {
            VOResponseGetRecommendedPublications response = new VOResponseGetRecommendedPublications();
            try
            {
                List<SpaceTypeRecommended> recommended = spaces.GetRecommendedPublications();
                List<VOSpaceTypeRecommended> voRecommended = STypeRecommendedToVOSTypeRecommendedConverter.Convert(recommended);
                response.Recommended = voRecommended;
                String message = EnumMessages.SUCC_FAVORITESOK.ToString();
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Updates preferential publication payment state (approve or reject) and
        /// sends mail to publisher
        /// </summary>
        /// <param name="voUpdatePayment"></param>
        public VOResponseUpdatePreferentialPaymentAdmin UpdatePreferentialPaymentAdmin(VORequestUpdatePreferentialPaymentAdmin voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePreferentialPaymentAdmin response = new VOResponseUpdatePreferentialPaymentAdmin();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    UserBasicData publisher = spaces.UpdatePreferentialPaymentAdmin(voUpdatePayment.IdPublication, voUpdatePayment.Approved, voUpdatePayment.RejectedReason);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = publisher.Name;
                    Publication publication = spaces.GetSpace(voUpdatePayment.IdPublication, null, false);
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = publication.Title;
                    keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                    EmailDataGeneric mailData;
                    if (voUpdatePayment.Approved)
                    {
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_PREFERENTIAL_PLAN_APPROVED, publisher.Language, keyValuePairs);
                    } else
                    {
                        keyValuePairs[ParamCodes.REJECTED_REASON] = voUpdatePayment.RejectedReason;
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_PREFERENTIAL_PLAN_REJECTED, publisher.Language, keyValuePairs);
                    }
                    emailUtil.SendEmailAsync(publisher.Mail, mailData.Body, mailData.Subject);
                    message = EnumMessages.SUCC_PAYMENTUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            } catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
        }

        /// <summary>
        /// Updates commission payment state (approve or reject) and
        /// sends mail to publisher
        /// </summary>
        /// <param name="voUpdatePayment"></param>
        public VOResponseUpdatePaymentCommissionAdmin UpdatePaymentCommissionAdmin(VORequestUpdatePaymentCommissionAdmin voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePaymentCommissionAdmin response = new VOResponseUpdatePaymentCommissionAdmin();
                String message = util.ValidAccessToken(voUpdatePayment.AccessToken, voUpdatePayment.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    UserBasicData publisher = spaces.UpdatePaymentCommissionAdmin(voUpdatePayment.IdReservation, voUpdatePayment.Approved, voUpdatePayment.RejectedReason);
                    Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
                    keyValuePairs[ParamCodes.USER_NAME] = publisher.Name;
                    string title = spaces.GetPublicationTitleByReservationId(voUpdatePayment.IdReservation);
                    keyValuePairs[ParamCodes.PUBLICATION_TITLE] = title;
                    EmailDataGeneric mailData;
                    if (voUpdatePayment.Approved)
                    {
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_COMMISSION_APPROVED, publisher.Language, keyValuePairs);
                    }
                    else
                    {
                        keyValuePairs[ParamCodes.REJECTED_REASON] = voUpdatePayment.RejectedReason;
                        keyValuePairs[ParamCodes.PROJECT_NAME] = projectName;
                        mailData = emailUtil.GetFormatMailPublications(EmailFormatCodes.CODE_PAYMENT_COMMISSION_REJECTED, publisher.Language, keyValuePairs);
                    }
                    emailUtil.SendEmailAsync(publisher.Mail, mailData.Body, mailData.Subject);
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

        /// <summary>
        /// Returns messages of publications
        /// </summary>
        /// <param name="voGetMessages"></param>
        /// <returns> Messages </returns>
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
                    List<Message> messages = spaces.GetMessages(isPublisher, user.IdUser); ;
                    List<VOMessage> voMessages = MessageToVOMessageConverter.Convert(messages);
                    response.Messages = voMessages;
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

        /// <summary>
        /// Updates amount of commission
        /// </summary>
        /// <param name="voUpdateAmount"></param>
        public VOResponseUpdateCommissionAmountAdmin UpdateCommissionAmountAdmin(VORequestUpdateCommissionAmountAdmin voUpdateAmount)
        {
            try
            {
                VOResponseUpdateCommissionAmountAdmin response = new VOResponseUpdateCommissionAmountAdmin();
                String message = util.ValidAccessToken(voUpdateAmount.AccessToken, voUpdateAmount.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    spaces.UpdateCommissionAmountAdmin(voUpdateAmount.IdReservation, voUpdateAmount.Price);                   
                    message = EnumMessages.SUCC_COMMISSIONUPDATED.ToString();
                }
                response.responseCode = message;
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Returns all reservations
        /// </summary>
        /// <param name="voGetReservations"></param>
        /// <returns> Reservations </returns>
        public VOResponseGetReservations GetReservations(VORequestGetReservations voGetReservations)
        {
            try
            {
                VOResponseGetReservations response = new VOResponseGetReservations();
                String message = util.ValidAccessToken(voGetReservations.AccessToken, voGetReservations.Mail);
                if (EnumMessages.OK.ToString().Equals(message))
                {
                    List<ReservationExtended> reservations = spaces.GetReservations();
                    List<VOReservationExtended> voReservations = ReservationExtendedToVOReservationExtendedConverter.Convert(reservations);
                    response.Reservations = voReservations;
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

        /// <summary>
        /// Updates finished publications state 
        /// </summary>
        private VOResponse FinishPublications()
       {
            VOResponse response = new VOResponse();
            EmailDataGeneric mailData;
            try
            {
                //Finish Publications
                List<EmailData> finishedPublications = spaces.FinishPublications();
                //Send email to publishers
                foreach (var publication in finishedPublications)
                {
                    mailData = emailUtil.GetFormatMailFinishPublications(EmailFormatCodes.CODE_FINISH_PUBLICATION, publication.PublisherLanguage, publication);
                    emailUtil.SendEmailAsync(publication.PublisherMail, mailData.Body, mailData.Subject);
                }
                response.responseCode = EnumMessages.SUCC_STATESUPDATES.ToString();
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }

        }

        /// <summary>
        /// Updates finished reservations state
        /// </summary>
        private VOResponse FinishReservations()
       {
            VOResponse response = new VOResponse();
            EmailDataGeneric mailData;
            try
            {                
                //Finish Reservations
                List<EmailData> finishedReservations = spaces.FinishReservations();                
                foreach (var publication in finishedReservations)
                {
                    //Send email to publisher
                    mailData = emailUtil.GetFormatMailFinishReservations(EmailFormatCodes.CODE_FINISH_RESERVATION_PUBLISHER, publication.PublisherLanguage, publication, false);
                    emailUtil.SendEmailAsync(publication.PublisherMail, mailData.Body, mailData.Subject);
                    //Send email to customer
                    mailData = emailUtil.GetFormatMailFinishReservations(EmailFormatCodes.CODE_FINISH_RESERVATION_CUSTOMER, publication.CustomerLanguage, publication, true);
                    emailUtil.SendEmailAsync(publication.CustomerMail, mailData.Body, mailData.Subject);
                }
                response.responseCode = EnumMessages.SUCC_STATESUPDATES.ToString();
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Update reservations state to in progress
        /// </summary>
        private VOResponse StartReservation()
        {
            VOResponse response = new VOResponse();
            try
            {
                //Make reservation state = in progress
                spaces.StartReservation();
                response.responseCode = EnumMessages.SUCC_STATESUPDATES.ToString();
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Calls FinishReservations, FinishPublications and StartReservations
        /// </summary>
        /// <param name="voCreateDeviceToken"></param>
        /// <returns></returns>
        public VOResponse RunScheduledJobs()
        {
            VOResponse response = new VOResponse();
            try
            {
                FinishPublications();
                FinishReservations();
                StartReservation();
                response.responseCode = EnumMessages.SUCC_STATESUPDATES.ToString();
                return response;
            }
            catch (GeneralException e)
            {
                throw e;
            }


        }
        /// <summary>
        /// Insert device token
        /// </summary>
        /// <param name="voCreateDeviceToken"></param>
        /// <returns></returns>
        public VOResponseCreateDeviceToken CreateDeviceToken(VORequestCreateDeviceToken voCreateDeviceToken)
        {
            try
            {
                VOResponseCreateDeviceToken response = new VOResponseCreateDeviceToken();
                String message;
                users.InsertDeviceToken(voCreateDeviceToken.Mail, voCreateDeviceToken.DeviceToken);
                message = EnumMessages.SUCC_TOKENINSERTED.ToString();                
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
