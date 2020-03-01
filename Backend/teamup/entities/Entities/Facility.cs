
namespace backend.Logic.Entities
{
    public class Facility
    {
        public int Code { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }

        public Facility() { }
        public Facility(int code, string description, string icon)
        {
            Code = code;
            Description = description;
            Icon = icon;
        }
    }
}
