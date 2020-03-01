using System;

namespace backend.Logic.Entities
{

    /// <summary>
    /// This class purpose is to keep info needed to send mail for scheduled jobs
    /// </summary>
    public class EmailData
    {
        public String PublisherMail { get; set; }
        public String PublisherName { get; set; }
        public int PublisherLanguage { get; set; }
        public String CustomerMail { get; set; }
        public String CustomerName { get; set; }
        public int CustomerLanguage { get; set; }
        public String PublicationTitle { get; set; }

        public EmailData() { }

        public EmailData(string publisherMail, string publisherName, int publisherLanguage, string customerMail, string customerName, int customerLanguage, string publicationTitle)
        {
            PublisherMail = publisherMail;
            PublisherName = publisherName;
            PublisherLanguage = publisherLanguage;
            CustomerMail = customerMail;
            CustomerName = customerName;
            CustomerLanguage = customerLanguage;
            PublicationTitle = publicationTitle;
        }
    }
}
