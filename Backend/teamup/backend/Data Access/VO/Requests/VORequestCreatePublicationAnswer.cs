using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestCreatePublicationAnswer : VOTokens
    {
        public string Mail { get; set; }
        public int IdQuestion { get; set; }
        public string Answer { get; set; }
        
        public VORequestCreatePublicationAnswer(string mail, int idQuestion, string answer, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdQuestion = idQuestion;
            Answer = answer;
        }
    }
}

