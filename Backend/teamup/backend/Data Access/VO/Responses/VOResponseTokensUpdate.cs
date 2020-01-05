using backend.Data_Access.VO.Data;
using backend.Logic;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseTokensUpdate : VOResponse
    {
        public String AccessToken { get; set; }
        public String RefreshToken { get; set; }
        public User User { get; set; }
        public VOResponseTokensUpdate() { }
        public VOResponseTokensUpdate(User user, string accessToken, string refreshToken)
        {
            User = user;
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }
    }
}
