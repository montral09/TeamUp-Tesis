namespace backend.Logic.Entities
{
    public class Payment
    {
        public int PaymentState { get; set; } 
        public string PaymentDescription { get; set; }
        public string PaymentComment { get; set; }
        public string PaymentEvidence { get; set; }
        public string PaymentDate { get; set; }
        public int Commission { get; set; }
       
        public Payment() { }

        public Payment(int paymentState, string paymentDescription, string paymentComment, 
            string paymentEvidence, string paymentDate, int commission)
        {
            PaymentState = paymentState;
            PaymentDescription = paymentDescription;
            PaymentComment = paymentComment;
            PaymentEvidence = paymentEvidence;
            PaymentDate = paymentDate;
            Commission = commission;
        }
    }
}
