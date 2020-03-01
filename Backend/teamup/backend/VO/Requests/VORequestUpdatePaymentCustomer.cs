using backend.Data_Access.VO.Data;

namespace backend.Data_Access.VO
{
    public class VORequestUpdatePaymentCustomer : VOTokens
    {
        public int IdReservation { get; set; }
        public string Mail { get; set; }
        public bool Approved { get; set; }
        public string RejectedReason { get; set; }

        public VORequestUpdatePaymentCustomer(int idReservation, string mail, bool approved, string rejectedReason, string accessToken) : base (accessToken)
        {
            IdReservation = idReservation;
            AccessToken = accessToken;
            Mail = mail;
            Approved = approved;
            RejectedReason = rejectedReason;
        }
    }
}

