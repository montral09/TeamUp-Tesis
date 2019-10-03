using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseTokensUpdate : VOResponse
    {
        public String AccessToken { get; set; }
        public String RefreshToken { get; set; }
        public VOResponseTokensUpdate() { }
        public VOResponseTokensUpdate(string accessToken, string refreshToken)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }
    }
}
