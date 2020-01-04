
namespace backend.Logic
{
    public static class EmailFormatCodes
    {
        // Users
        public static string CODE_APPROVE_PUBLISHER { get { return "APPROVEPUBLISHER"; } }
        public static string CODE_USER_CREATED { get { return "USERCREATED"; } }
        public static string CODE_USER_MODIFIED { get { return "USERMODIFIED"; } }
        public static string CODE_USER_DELETED { get { return "USERDELETED"; } }
        public static string CODE_PASSWORD_RESETED { get { return "PASSWORDRESETED"; } }
        //Publications
        public static string CODE_PUBLICATION_CREATED { get { return "PUBLICATIONCREATED"; } }
        public static string CODE_PUBLICATION_CREATED_ADMIN { get { return "PUBLICATIONCREATEDADMIN"; } }
        public static string CODE_PUBLICATION_APPROVED { get { return "PUBLICATIONAPPROVED"; } }
        public static string CODE_PUBLICATION_REJECTED { get { return "PUBLICATIONREJECTED"; } }
        public static string CODE_PUBLICATION_MODIFIED { get { return "PUBLICATIONMODIFIED"; } }
        public static string CODE_PUBLICATION_MODIFIED_ADMIN { get { return "PUBLICATIONMODIFIEDADMIN"; } }
        public static string CODE_PUBLICATION_NEW_QUESTION { get { return "PUBLICATIONNEWQUESTION"; } }
        public static string CODE_PUBLICATION_NEW_ANSWER { get { return "PUBLICATIONNEWANSWER"; } }
        //Payments
        public static string CODE_PAYMENT_PREFERENTIAL_PLAN { get { return "PAYMENTPREFERENTIALPLAN"; } }
        public static string CODE_PAYMENT_COMMISSION { get { return "PAYMENTCOMMISSION"; } }
        public static string CODE_PAYMENT_PREFERENTIAL_PLAN_APPROVED { get { return "PAYMENTPREFERENTIALPLANAPPROVED"; } }
        public static string CODE_PAYMENT_PREFERENTIAL_PLAN_REJECTED { get { return "PAYMENTPREFERENTIALPLANREJECTED"; } }
        public static string CODE_PAYMENT_RESERVATION_APPROVED { get { return "RESERVATIONPAYMENTAPPROVED"; } }
        public static string CODE_PAYMENT_RESERVATION_REJECTED { get { return "RESERVATIONPAYMENTREJECTED"; } }
        public static string CODE_PAYMENT_COMMISSION_APPROVED { get { return "COMMISSIONPAYMENTAPPROVED"; } }
        public static string CODE_PAYMENT_COMMISSION_REJECTED { get { return "COMMISSIONPAYMENTREJECTED"; } }
        //Reservations
        public static string CODE_RESERVATION_CREATED_PUBLISHER { get { return "NEWRESERVATIONPUBLISHER"; } }
        public static string CODE_RESERVATION_CREATED_CUSTOMER { get { return "NEWRESERVATIONCUSTOMER"; } }
        public static string CODE_RESERVATION_CONFIRMED_CUSTOMER { get { return "RESERVATIONCONFIRMEDCUSTOMER"; } }
        public static string CODE_RESERVATION_CANCELLED_CUSTOMER { get { return "RESERVATIONCANCELLEDCUSTOMER"; } }
        public static string CODE_RESERVATION_CANCELLED_PUBLISHER { get { return "RESERVATIONCANCELLEDPUBLISHER"; } }
        public static string CODE_RESERVATION_MODIFIED_CUSTOMER { get { return "RESERVATIONMODIFIEDCUSTOMER"; } }
        public static string CODE_RESERVATION_MODIFIED_PUBLISHER { get { return "RESERVATIONMODIFIEDPUBLISHER"; } }
        public static string CODE_RESERVATION_PAID { get { return "RESERVATIONPAID"; } }
        

    }
}
