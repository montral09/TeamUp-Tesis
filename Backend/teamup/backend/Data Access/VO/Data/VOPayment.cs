using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOPayment
    {
        public int PaymentState { get; set; } 
        public string PaymentDescription { get; set; }
        public string PaymentComment { get; set; }
        public string PaymentEvidence { get; set; }
        public string PaymentDate { get; set; }
        public int Commission { get; set; }
       
        public VOPayment() { }

        public VOPayment(int paymentState, string paymentDescription, string paymentComment, 
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
