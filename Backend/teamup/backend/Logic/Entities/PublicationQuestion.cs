using System;

namespace backend.Logic.Entities
{
    public class PublicationQuestion : IComparable<PublicationQuestion>
    {
        public int IdQuestion { get; set; }
        public string Name { get; set; }
        public string Question { get; set; }
        public string CreationDate { get; set; }
        public Answer Answer { get; set; }

        public PublicationQuestion() { }
        public PublicationQuestion(int idQuestion, string name, string question, string creationDate, Answer answer)
        {
            IdQuestion = idQuestion;
            Name = name;
            Question = question;
            CreationDate = creationDate;
            Answer = answer;
        }

        public int CompareTo(PublicationQuestion other)
        {
            return other.CreationDate.CompareTo(CreationDate);
        }
    }
}
