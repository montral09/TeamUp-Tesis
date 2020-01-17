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
using System.Xml;

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

        public int ConvertStateReservation(string oldState)
        {
            switch (oldState)
            {
                case "PENDING":
                    return 1;
                case "RESERVED":
                    return 2;
                case "IN PROGRESS":
                    return 3;                
                case "FINISHED":
                    return 4;
                case "CANCELED":
                    return 5;
                default:
                    return 0;
            }
        }
        
        public static string ConvertDateToString(DateTime date)
        {
            if (date != null)
            {
                return date.ToString("dd/MM/yyyy");
            }
            return "";
        }

        public static List<T> ShuffleRecommended<T>(IList<T> recommended)
        {
            List<T> randomRecommended = new List<T>();
            Random randomNumber = new Random();            
            while (recommended.Count() > 0)
            {                
                var nextIndex = randomNumber.Next(0, recommended.Count());                
                T value = recommended[nextIndex];                
                randomRecommended.Add(value);
                recommended.RemoveAt(nextIndex);
            }
            return randomRecommended;
        }

        public static int CalculateReservationCommission(int reservationPrice)
        {
            int commission = Convert.ToInt32(ConfigurationManager.AppSettings["COMMISSION"]);
            return reservationPrice * commission / 100;
        }


        /// <summary>
        /// Calculate remaining amout to be paid
        /// Calculation: [new plan price] * [daysLeft] - [old plan price] * [daysLeft]
        /// </summary>
        /// <param name="daysLeft"></param>
        /// <param name="currentPreferentialPlan"></param>
        /// <param name="newPreferentialPlan"></param>
        /// <param name="preferentialPlans"></param>
        /// <returns> amount to be paid </returns>
        internal static int RecalculatePrice(int daysLeft, int currentPreferentialPlan, int newPreferentialPlan, List<VOPublicationPlan> preferentialPlans)
        {
            int currentPlanPricePerDay = 0;
            int newPlanPricePerDay = 0;

            foreach (VOPublicationPlan publicationPlan in preferentialPlans)
            {
                if (publicationPlan.IdPlan == currentPreferentialPlan)
                {
                    currentPlanPricePerDay = Convert.ToInt32(publicationPlan.Price / publicationPlan.Days);
                } else if (publicationPlan.IdPlan == newPreferentialPlan)
                {
                    newPlanPricePerDay = Convert.ToInt32(publicationPlan.Price / publicationPlan.Days);
                }
            }
            return newPlanPricePerDay * daysLeft - currentPlanPricePerDay * daysLeft;            
        }
    }
}
