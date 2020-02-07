namespace backend.Data_Access.VO.Data
{
    public class VOPublicationPaymentAdmin
    {
        public int IdPublication { get; set; }
        public string Publication { get; set; }
        public string PublisherMail { get; set; }
        public string PublisherName { get; set; }
        public string PublisherLastName { get; set; }
        public string PublisherPhone { get; set; }
        public string PreferentialPlanName { get; set; }
        public string PreferentialPlanState { get; set; }
        public int Price { get; set; }
        public string Comment { get; set; }
        public string Evidence { get; set; }
        public string PaymentDate { get; set; }
     
        public VOPublicationPaymentAdmin() { }

        
        public VOPublicationPaymentAdmin(int idPublication, string publication, string publisherMail, string publisherName, string publisherLastName,
            string publisherPhone, string preferentialPlanName, string preferentialPlanState, int price, string comment, string evidence, string paymentDate)
            
        {
            IdPublication = idPublication;
            Publication = publication;
            PublisherMail = publisherMail;
            PublisherName = publisherName;
            PublisherLastName = publisherLastName;
            PublisherPhone = publisherPhone;
            PreferentialPlanName = preferentialPlanName;
            PreferentialPlanState = preferentialPlanState;
            Price = price;
            Comment = comment;
            Evidence = evidence;
            PaymentDate = paymentDate;
        }
    }
}
