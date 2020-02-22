using System;

namespace backend.Logic.Entities
{
    public class Tokens
    { 
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public Tokens() { }

        public Tokens(String accessToken, String refreshToken)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;            
        }

        public Tokens(String accessToken)
        {
            AccessToken = accessToken;
        }
    }
}
