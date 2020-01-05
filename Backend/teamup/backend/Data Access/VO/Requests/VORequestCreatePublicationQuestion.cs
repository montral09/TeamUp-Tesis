using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestCreatePublicationQuestion : VOTokens
    {
        public string Mail { get; set; }
        public int IdPublication { get; set; }
        public string Question { get; set; }
        
        public VORequestCreatePublicationQuestion(string mail, int idPublication, string question, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdPublication =idPublication;
            Question = question;
        }
    }
}

