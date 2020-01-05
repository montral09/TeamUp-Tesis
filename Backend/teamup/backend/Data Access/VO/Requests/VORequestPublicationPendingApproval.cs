using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestPublicationPendindApproval : VOTokens
    {
        public String AdminMail { get; set; }

        public VORequestPublicationPendindApproval(string accessToken, string adminMail) : base (accessToken)
        {
            AccessToken = accessToken;
            AdminMail = adminMail;
        }
    }
}

