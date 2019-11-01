using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace backend.Logic
{
    public class Util
    {
        string SENDER_MAIL = ConfigurationManager.AppSettings["EMAIL_ADMIN"];
        string SENDER_PASSWORD = ConfigurationManager.AppSettings["EMAIL_PASS"];

        public void SendEmailAsync(string to, string body, string subject)
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
        }

        public static string GetRandomString()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", "");
            return path;
        }

        public static string CreateFacilitiesString(List<int> facilities)
        {
            return String.Join<int>(",", facilities);
        }

        public static string CreateBodyEmailNewPublicationToPublisher(String name)
        {
            string body = "Hello, " + name;
            body += "<br /><br />Your publication request has been submitted and will be available within 24 hours.";
            body += "<br /><br />Thanks";
            return body;
        }

        public static string CreateBodyEmailNewPublicationToAdmin(string publisherMail)
        {
            string body = "Hello,";
            body += "<br /><br />A new publication request has been submitted. Please check " + publisherMail + " publications.";
            body += "<br /><br />Thanks";
            return body;
        }

        public List<int> ConvertFacilities(String facilitiesString)
        {
            List<int> facilities = new List<int>();
            if (!String.IsNullOrEmpty(facilitiesString)) {
                facilities = facilitiesString.Split(',').Select(int.Parse).ToList();
            }
            return facilities;
        }                    


        public static string CreateStringImages(List<VOImage> images)
        {
            var sb = new StringBuilder();
            string separator = String.Empty;
            string delimiter = ",";
            for (int i = 0; i < images.Count; i++)
            {
                sb.Append(separator).Append((i+1) + "." + images[i].Extension);
                separator = delimiter;
            }
            return sb.ToString();
        }

        public int ConvertState(string oldState)
        {
            switch (oldState)
            {
                case "NOT VALIDATED":
                    return 1;
                case "ACTIVE":
                    return 2;
                case "PAUSED P":
                    return 3;
                case "PAUSED A":
                    return 4;
                case "FINISHED":
                    return 5;
                case "REJECTED":
                    return 6;
                default:
                    return 0;
            }
        }

        public bool UpdateValid(bool isAdmin, int oldCodeState, int newCodeState)
        {
            // string transition = oldCodeState + "-" + newCodeState;
            return true;
            // 1-2
        }

        public int GetRanking(List<VOReview> reviews)
        {
            int ranking = 0;
            int totalRankings = 0;
            if (reviews.Count != 0)
            {
                foreach (var item in reviews)
                {
                    totalRankings += item.Rating;
                }
                ranking = (int)Math.Ceiling((decimal)totalRankings / reviews.Count);
            }           
            return ranking;
        }
    }
}
