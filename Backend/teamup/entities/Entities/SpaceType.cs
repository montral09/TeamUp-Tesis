
namespace backend.Logic.Entities
{
    public class SpaceType
    {
        public int Code { get; set; }
        public string Description { get; set; }
        public bool IndividualRent { get; set; }

        public SpaceType() { }
        public SpaceType(int code, string description, bool individualRent)
        {
            Code = code;
            Description = description;
            IndividualRent = individualRent;
        }
    }
}
