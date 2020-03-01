
namespace backend.Logic.Entities
{
    public class Answer
    {
        public string AnswerText { get; set; }
        public string CreationDate { get; set; }

        public Answer() { }
        public Answer(string answer, string creationDate)
        {
            AnswerText = answer;
            CreationDate = creationDate;
        }
    }
}
