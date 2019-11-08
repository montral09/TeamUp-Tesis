using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestGetUserData : VOTokens
    {
        public VORequestGetUserData() { }
        public VORequestGetUserData(string accessToken) : base (accessToken)
        {
            AccessToken = accessToken;
        }
    }
}

