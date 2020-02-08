using backend.Data_Access;
using backend.Exceptions;
using backend.Logic.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Mail;

namespace backend.Logic
{
    public class EmailUtil
    {
        string SENDER_MAIL = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
        string SENDER_PASSWORD = ConfigurationManager.AppSettings["EMAIL_PASS"];
        private IDAOUtil daoUtil = new DAOUtil();

        public void SendEmailAsync(string to, string body, string subject)
        {
            try
            {
                MailMessage mm = new MailMessage(SENDER_MAIL, to);

                mm.Body = body;
                mm.Subject = subject;
                mm.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                NetworkCredential NetworkCred = new NetworkCredential(SENDER_MAIL, SENDER_PASSWORD);
                smtp.UseDefaultCredentials = true;
                smtp.Credentials = NetworkCred;
                smtp.Port = 587;
                smtp.Send(mm);
            } catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }           
        }

        public EmailDataGeneric GetFormatMailUsers(String code, int language, Dictionary<string, string> keyValuePairs)
        {
            try
            {
                EmailDataGeneric emailBodyGeneric = daoUtil.GetEmailDataGeneric(code, language);
                emailBodyGeneric.Body = CompleteEmailBodyUsers(emailBodyGeneric.Body, keyValuePairs);
                return emailBodyGeneric;
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
        }

        private string CompleteEmailBodyUsers(string emailBodyGeneric, Dictionary<string, string> keyValuePairs)
        {

            if (emailBodyGeneric.Contains(ParamCodes.USER_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.USER_NAME, keyValuePairs[ParamCodes.USER_NAME]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PROJECT_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PROJECT_NAME, keyValuePairs[ParamCodes.PROJECT_NAME]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.ACTIVATION_LINK))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.ACTIVATION_LINK, keyValuePairs[ParamCodes.ACTIVATION_LINK]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.LOGIN_LINK))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.LOGIN_LINK, keyValuePairs[ParamCodes.LOGIN_LINK]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.TEMP_PASSWORD))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.TEMP_PASSWORD, keyValuePairs[ParamCodes.TEMP_PASSWORD]);
            }
            return emailBodyGeneric;
        }

        public EmailDataGeneric GetFormatMailPublications(String code, int language, Dictionary<string, string> keyValuePairs)
        {            
            try
            {
                EmailDataGeneric emailBodyGeneric = daoUtil.GetEmailDataGeneric(code, language);
                emailBodyGeneric.Body = CompleteEmailBodyPublications(emailBodyGeneric.Body, keyValuePairs);
                return emailBodyGeneric;
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
        }

        private string CompleteEmailBodyPublications(string emailBodyGeneric, Dictionary<string, string> keyValuePairs)
        {
            if (emailBodyGeneric.Contains(ParamCodes.USER_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.USER_NAME, keyValuePairs[ParamCodes.USER_NAME]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PUBLICATION_TITLE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PUBLICATION_TITLE, keyValuePairs[ParamCodes.PUBLICATION_TITLE]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PROJECT_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PROJECT_NAME, keyValuePairs[ParamCodes.PROJECT_NAME]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PUBLISHER_EMAIL))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PUBLISHER_EMAIL, keyValuePairs[ParamCodes.PUBLISHER_EMAIL]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.AVAILABILITY))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.AVAILABILITY, keyValuePairs[ParamCodes.AVAILABILITY]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.DATE_TO))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.DATE_TO, keyValuePairs[ParamCodes.DATE_TO]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PREFERENTIAL_PLAN))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PREFERENTIAL_PLAN, keyValuePairs[ParamCodes.PREFERENTIAL_PLAN]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.REJECTED_REASON))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.REJECTED_REASON, keyValuePairs[ParamCodes.REJECTED_REASON]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.COMMENT))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.COMMENT, keyValuePairs[ParamCodes.COMMENT]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.QUESTION))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.QUESTION, keyValuePairs[ParamCodes.QUESTION]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.ANSWER))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.ANSWER, keyValuePairs[ParamCodes.ANSWER]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PRICE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PRICE, keyValuePairs[ParamCodes.PRICE]);
            }
            return emailBodyGeneric;
        }

        public EmailDataGeneric GetFormatMailReservations(String code, int language, Dictionary<string, string> keyValuePairs)
        {
            try
            {
                EmailDataGeneric emailBodyGeneric = daoUtil.GetEmailDataGeneric(code, language);
                emailBodyGeneric.Body = CompleteEmailBodyReservations(emailBodyGeneric.Body, keyValuePairs);
                return emailBodyGeneric;
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
        }

        private string CompleteEmailBodyReservations(string emailBodyGeneric, Dictionary<string, string> keyValuePairs)
        {
            if (emailBodyGeneric.Contains(ParamCodes.USER_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.USER_NAME, keyValuePairs[ParamCodes.USER_NAME]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PUBLICATION_TITLE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PUBLICATION_TITLE, keyValuePairs[ParamCodes.PUBLICATION_TITLE]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PROJECT_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PROJECT_NAME, keyValuePairs[ParamCodes.PROJECT_NAME]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.DATE_FROM))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.DATE_FROM, keyValuePairs[ParamCodes.DATE_FROM]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.RESERVATION_PLAN))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.RESERVATION_PLAN, keyValuePairs[ParamCodes.RESERVATION_PLAN]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.RESERVED_QUANTITY))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.RESERVED_QUANTITY, keyValuePairs[ParamCodes.RESERVED_QUANTITY]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.QUANTITY_PEOPLE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.QUANTITY_PEOPLE, keyValuePairs[ParamCodes.QUANTITY_PEOPLE]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.PRICE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PRICE, keyValuePairs[ParamCodes.PRICE]);
            }
            if (emailBodyGeneric.Contains(ParamCodes.REJECTED_REASON))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.REJECTED_REASON, keyValuePairs[ParamCodes.REJECTED_REASON]);
            }
            return emailBodyGeneric;
        }

        public EmailDataGeneric GetFormatMailFinishPublications(String code, int language, EmailData emailData)
        {
            EmailDataGeneric emailBodyGeneric = daoUtil.GetEmailDataGeneric(code, language);
            emailBodyGeneric.Body = CompleteEmailBodyFinishPublications(emailBodyGeneric.Body, emailData);
            return emailBodyGeneric;
        }

        private string CompleteEmailBodyFinishPublications(string emailBodyGeneric, EmailData emailData)
        {
            if (emailBodyGeneric.Contains(ParamCodes.PUBLICATION_TITLE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PUBLICATION_TITLE, emailData.PublicationTitle);
            }
            if (emailBodyGeneric.Contains(ParamCodes.USER_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.USER_NAME, emailData.PublisherName);
            }
            return emailBodyGeneric;
        }

        public EmailDataGeneric GetFormatMailFinishReservations(String code, int language, EmailData emailData, bool isCustomer)
        {
            EmailDataGeneric emailBodyGeneric = daoUtil.GetEmailDataGeneric(code, language);
            emailBodyGeneric.Body = CompleteEmailBodyFinishReservations(emailBodyGeneric.Body, emailData, isCustomer);
            return emailBodyGeneric;
        }

        private string CompleteEmailBodyFinishReservations(string emailBodyGeneric, EmailData emailData, bool isCustomer)
        {
            if (emailBodyGeneric.Contains(ParamCodes.PUBLICATION_TITLE))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.PUBLICATION_TITLE, emailData.PublicationTitle);
            }
            if (emailBodyGeneric.Contains(ParamCodes.USER_NAME))
            {
                emailBodyGeneric = emailBodyGeneric.Replace(ParamCodes.USER_NAME, isCustomer ? emailData.CustomerName : emailData.PublisherName);
            }
            return emailBodyGeneric;
        }

    }
}
