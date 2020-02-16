using System;

namespace backend.Data_Access.VO.Data
{
    public class VOTokens
    { 
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public VOTokens() { }

        public VOTokens(String accessToken, String refreshToken)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;            
        }

        public VOTokens(String accessToken)
        {
            AccessToken = accessToken;
        }
    }
}
