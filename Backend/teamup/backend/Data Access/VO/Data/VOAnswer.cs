using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOAnswer
    {
        public string Answer { get; set; }
        public string CreationDate { get; set; }

        public VOAnswer() { }
        public VOAnswer(string answer, string creationDate)
        {
            Answer = answer;
            CreationDate = creationDate;
        }
    }
}
