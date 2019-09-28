using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseAdminLogin : VOResponse
    {
        public VOAdmin voAdmin;
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public VOResponseAdminLogin() { }
        public VOResponseAdminLogin(VOAdmin voAdmin, string accessToken, string refreshToken)
        {
            this.voAdmin = voAdmin;
            AccessToken = accessToken;
            RefreshToken = refreshToken;
        }
    }
}
