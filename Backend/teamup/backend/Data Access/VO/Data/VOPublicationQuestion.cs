using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Data
{
    public class VOPublicationQuestion
    {
        public int IdQuestion { get; set; }
        public string Name { get; set; }
        public string Question { get; set; }
        public string CreationDate { get; set; }
        public VOAnswer Answer { get; set; }

        public VOPublicationQuestion() { }
        public VOPublicationQuestion(int idQuestion, string name, string question, string creationDate, VOAnswer answer)
        {
            IdQuestion = idQuestion;
            Name = name;
            Question = question;
            CreationDate = creationDate;
            Answer = answer;
        }
    }
}
