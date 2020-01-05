using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseLogin : VOResponse
    {
        public VOUser voUserLog;
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public VOResponseLogin() { }
        public VOResponseLogin(VOUser voUser, string accessToken, string refreshToken)
        {
            this.voUserLog = voUser;
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }
    }
}
