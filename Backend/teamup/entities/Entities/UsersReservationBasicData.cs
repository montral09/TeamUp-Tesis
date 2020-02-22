using System;

namespace backend.Logic.Entities
{
    public class UsersReservationBasicData
    {
        public String CustomerMail { get; set; }
        public String CustomerName { get; set; }
        public int CustomerLanguage { get; set; }
        public String PublisherMail { get; set; }
        public String PublisherName { get; set; }
        public int PublisherLanguage { get; set; }
        public int IdPlan { get; set; }

        public UsersReservationBasicData() { }

        public UsersReservationBasicData(String cMail, String cName, int cLanguage, String pMail, String pName, int pLanguage, int idPlan)
        {
            CustomerMail = cMail;
            CustomerName = cName;
            CustomerLanguage = cLanguage;
            PublisherMail = pMail;
            PublisherName = pName;
            PublisherLanguage = pLanguage;
            IdPlan = idPlan;
        }
    }
}
