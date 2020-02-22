using backend.Data_Access.VO.Data;

namespace backend.Data_Access.VO
{
    public class VORequestGetMessages : VOTokens
    {
 
        public string Mail { get; set; }        

        public VORequestGetMessages() { }
        public VORequestGetMessages(string mail, string accessToken) : base (accessToken)
        {
            Mail = mail;
            AccessToken = accessToken;
        }
    }
}

