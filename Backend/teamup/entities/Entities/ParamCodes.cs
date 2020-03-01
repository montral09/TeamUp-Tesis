
using System.Collections.Generic;

namespace backend.Logic
{
    public static class ParamCodes
    {
        public static string PROJECT_NAME { get { return "[projectName]"; } }
        //Users
        public static string USER_NAME { get { return "[userName]"; } }
        public static string ACTIVATION_LINK { get { return "[activationLink]"; } }
        public static string LOGIN_LINK { get { return "[loginLink]"; } }
        public static string TEMP_PASSWORD { get { return "[temporalPassword]"; } }
        public static string PUBLISHER_EMAIL { get { return "[publisherEmail]"; } }
        //Publications
        public static string PUBLICATION_TITLE { get { return "[publicationTitle]"; } }
        public static string DATE_TO { get { return "[dateTo]"; } }
        public static string AVAILABILITY { get { return "[availability]"; } }
        public static string PREFERENTIAL_PLAN { get { return "[preferentialPlan]"; } }
        public static string REJECTED_REASON { get { return "[rejectedReason]"; } }
        public static string COMMENT { get { return "[comment]"; } }
        public static string QUESTION { get { return "[question]"; } }
        public static string ANSWER { get { return "[answer]"; } }
        //Reservations
        public static string DATE_FROM { get { return "[dateFrom]"; } }
        public static string RESERVATION_PLAN { get { return "[reservationPlan]"; } }
        public static string RESERVED_QUANTITY { get { return "[reservedQuantity]"; } }
        public static string QUANTITY_PEOPLE { get { return "[quantityPeople]"; } }
        public static string PRICE { get { return "[price]"; } }
    }
}
