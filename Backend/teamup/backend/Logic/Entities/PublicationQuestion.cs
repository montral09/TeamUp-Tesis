namespace backend.Logic.Entities
{
    public class PublicationQuestion
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
    }
}
