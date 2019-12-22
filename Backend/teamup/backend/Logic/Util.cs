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
  
            return true; 
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

        public void SendEmailPublicationStatus(string to, string name, string title, string rejectedReason, int statusCode)
        {
            MailMessage mm = new MailMessage(SENDER_MAIL, to);
            string body = "Hello " + name + ",";
            string subject;
            if (statusCode == 2)
            //Active
            {                
                body += "<br /><br />Your publication " + title + " has been approved. This means other users will see it and rented. Congratulations!.";
                subject = "Publication approved";
            } else
            //Rejected
            {
                body += "<br /><br />Your publication " + title + " has been rejected. Reason: " + rejectedReason + " You can contact our team for further information";
                subject = "Publication rejected";
            }
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

        public static string CreateBodyEmailNewReservationToPublisher(String name)
        {
            string body = "Hello, " + name;
            body += "<br /><br />One of your publication has been reserved!.";
            body += "<br /><br />Thanks";
            return body;
        }

        public static string CreateBodyEmailNewReservationToCustomer(string name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Has reservado una espacio, felicitaciones! El dueño del espacio se comunicará contigo a la brevedad ";
            body += "<br /><br />Thanks";
            return body;
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

        public bool UpdateValidReservation(bool isAdmin, int oldCodeState, int newCodeState)
        {
            return true;
        }

        public static string CreateBodyEmailStateReservationToPublisher(String name, string newState, string canceledReason)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Una de tus reservas ha cambiado a " + newState + ".";
            if (canceledReason != null)
            {
                body += "<br /><br />Motivo: " + canceledReason + ".";
            }
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailStateReservationToCustomer(String name, string newState, string canceledReason)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Una de tus reservas ha cambiado a " + newState + ".";
            if (canceledReason != null)
            {
                body += "<br /><br />Motivo: " + canceledReason + ".";
            }
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailUpdateReservationToPublisher(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Una de tus reservas ha sido modificada";           
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailUpdateReservationToCustomer(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Una de tus reservas ha sido modificada";            
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailPayReservationCustomer(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Una de tus reservas ha sido pagada";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string ConvertDateToString(DateTime date)
        {
            return date.ToString("dd/MM/yyyy");
        }

        public static string CreateBodyEmailPayCommissionToAdmin(string publisherMail)
        {
            string body = "Hola,";
            body += "<br /><br />Se ha efectuado el pago de una comision del cliente " + publisherMail + ".";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailApprovedPaymentCustomer(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Han confirmado el pago de tu reserva.";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailCanceledPaymentCustomer(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Han cancelado el pago de tu reserva.";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailApproveCommissionToPublisher(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />Se ha aprobado el pago de la comision de la reserva";
            body += "<br /><br />Gracias";
            return body;
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

        public static string CreateBodyEmailPreferentialPaymentApproved(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />El pago de plan de tu publicacion ha sido aprobado.";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailPreferentialPaymentRejected(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />El pago de plan de tu publicacion ha sido rechazado.";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailCommissionPaymentApproved(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />El pago de comision de la publicacion ha sido aprobado.";
            body += "<br /><br />Gracias";
            return body;
        }

        public static string CreateBodyEmailCommissionPaymentRejected(String name)
        {
            string body = "Hola, " + name;
            body += "<br /><br />El pago de comision de la publicacion ha sido rechazado.";
            body += "<br /><br />Gracias";
            return body;
        }
    }
}
