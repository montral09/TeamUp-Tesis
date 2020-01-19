
namespace backend.Data_Access.VO.Data
{
    public class VOPreferentialPlan
    {
        public int IdPlan { get; set; }
        public string Description { get; set; }
        public int StateCode { get; set; }
        public string StateDescription { get; set; }
        public int Price { get; set; }
        public int PublicationPrice { get; set; }
        public string PaymentDate { get; set; }
        public string Comment { get; set; }
        public string Evidence { get; set; }

        public VOPreferentialPlan() { }

        public VOPreferentialPlan(int idPlan, string description, int stateCode, string stateDescription, int price, int publicationPrice, string paymentDate, string comment, string evidence)
        {
            IdPlan = idPlan;
            Description = description;
            StateCode = stateCode;
            StateDescription = stateDescription;
            Price = price;
            PublicationPrice = publicationPrice;
            PaymentDate = paymentDate;
            Comment = comment;
            Evidence = evidence;
        }
    }
}
