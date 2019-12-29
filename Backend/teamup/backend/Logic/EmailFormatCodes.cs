
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
        //Reservations


    }
}
