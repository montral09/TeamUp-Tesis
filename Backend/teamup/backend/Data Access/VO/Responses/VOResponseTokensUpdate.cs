using backend.Data_Access.VO.Data;
using System;

namespace backend.Data_Access.VO
{
    public class VOResponseTokensUpdate : VOResponse
    {
        public String AccessToken { get; set; }
        public String RefreshToken { get; set; }
        public VOUser User { get; set; }
        public VOResponseTokensUpdate() { }
        public VOResponseTokensUpdate(VOUser user, string accessToken, string refreshToken)
        {
            User = user;
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }
    }
}
