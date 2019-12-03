using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdatePreferentialPayment : VOTokens
    {
        public String Mail { get; set; }
        public int IdPublication { get; set; }
        public String Comment { get; set; }
        public VOImage Evidence { get; set; }

        public VORequestUpdatePreferentialPayment(string mail, int idPublication, string comment, VOImage evidence, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdPublication = idPublication;
            Comment = comment;
            Evidence = evidence;
        }
    }
}

