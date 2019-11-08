using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestTokensUpdate : VOTokens
    {
        public new String RefreshToken { get; set; }
        public String Mail { get; set; }
        public VORequestTokensUpdate(String refreshToken, String mail) 
            : base(refreshToken)
        {
            Mail = mail;
            RefreshToken = refreshToken;
        }
    }
}

