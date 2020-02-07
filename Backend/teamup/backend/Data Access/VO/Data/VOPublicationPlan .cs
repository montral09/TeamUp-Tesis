namespace backend.Data_Access.VO.Data
{
    public class VOPublicationPlan
    {
        public int IdPlan { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int Days { get; set; }
       
        public VOPublicationPlan() { }
        public VOPublicationPlan(int idPlan, string name, int price, int days)
        {
            IdPlan = idPlan;
            Name = name;
            Price = price;
            Days = days;
        }
    }
}
