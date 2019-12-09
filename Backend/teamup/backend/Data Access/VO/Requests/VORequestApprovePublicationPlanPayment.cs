using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestApprovePublicationPlanPayment : VOTokens
    {
        public int IdPublication { get; set; }
        public string Mail { get; set; }

        public VORequestApprovePublicationPlanPayment(int idPublication, string mail, string accessToken) : base (accessToken)
        {
            IdPublication = idPublication;
            AccessToken = accessToken;
            Mail = mail;
        }
    }
}

