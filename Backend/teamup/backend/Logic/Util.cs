using backend.Data_Access.Query;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace backend.Logic
{
    public class Util
    {
        const string SENDER_MAIL = "teamupude@gmail.com";
        const string SENDER_PASSWORD = "teamupudeude";
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }
        public void SendEmail(string to, string body, string subject)
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
    }
}
