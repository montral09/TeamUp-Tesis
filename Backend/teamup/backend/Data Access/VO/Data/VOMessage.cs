namespace backend.Data_Access.VO.Data
{
    public class VOMessage : VOPublicationQuestion
    {
        public int IdPublication { get; set; }
        public string PublicationTitle { get; set; }
        public bool IsMyPublication { get; set; }

        public VOMessage() { }

        public VOMessage(int idPublication, string publicationTitle, bool isMyPublication, int idQuestion, string name, string question, string creationDate, VOAnswer answer) : base (idQuestion, name, question, creationDate, answer)
        {
            IdPublication = idPublication;
            PublicationTitle = publicationTitle;
            IsMyPublication = isMyPublication;
            IdQuestion = idQuestion;
            Name = name;
            Question = question;
            CreationDate = creationDate;
            Answer = answer;
        }

    }
}
