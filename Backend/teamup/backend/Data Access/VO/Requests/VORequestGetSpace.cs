
namespace backend.Data_Access.VO
{
    public class VORequestGetSpace
    { 
        public int IdSpace { get; set; }

        public VORequestGetSpace() { }
        public VORequestGetSpace(int idSpace) 
        {
            IdSpace = idSpace;
        }
    }
}

