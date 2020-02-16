using backend.Data_Access.VO.Data;
namespace backend.Data_Access.VO
{
    public class VORequestGetUsers : VOTokens
    {
 
        public string Mail { get; set; }

        public VORequestGetUsers() { }
        public VORequestGetUsers(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

