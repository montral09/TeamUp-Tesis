using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestApprovePublishers : VOTokens
    {
        public List<String> Mails { get; set; }
        public String AdminMail { get; set; }

        public VORequestApprovePublishers(List<String> mails, string accessToken, string adminMail) : base (accessToken)
        {
            Mails = mails;
            AccessToken = accessToken;
            AdminMail = adminMail;
        }
    }
}

