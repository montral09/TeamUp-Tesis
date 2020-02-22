namespace backend.Logic.Entities
{
    public class CommissionPaymentAdmin
    {
        public int IdReservation { get; set; }
        public string Publication { get; set; }
        public string PublisherMail { get; set; }
        public string PublisherName { get; set; }
        public string PublisherLastName { get; set; }
        public string PublisherPhone { get; set; }
        public int Commission { get; set; }
        public string CommissionState { get; set; }
        public string Comment { get; set; }
        public string Evidence { get; set; }
        public string PaymentDate { get; set; }
     
        public CommissionPaymentAdmin() { }

        
        public CommissionPaymentAdmin(int idReservation, string publication, string publisherMail, string publisherName, string publisherLastName,
            string publisherPhone, int commission, string commissionState, string comment, string evidence, string paymentDate)
            
        {
            IdReservation = idReservation;
            Publication = publication;
            PublisherMail = publisherMail;
            PublisherName = publisherName;
            PublisherLastName = publisherLastName;
            PublisherPhone = publisherPhone;
            Commission = commission;
            CommissionState = commissionState;
            Comment = comment;
            Evidence = evidence;
            PaymentDate = paymentDate;
        }
    }
}
