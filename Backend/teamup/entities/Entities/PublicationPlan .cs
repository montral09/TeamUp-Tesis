namespace backend.Logic.Entities
{
    public class PublicationPlan
    {
        public int IdPlan { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int Days { get; set; }
       
        public PublicationPlan() { }
        public PublicationPlan(int idPlan, string name, int price, int days)
        {
            IdPlan = idPlan;
            Name = name;
            Price = price;
            Days = days;
        }
    }
}
