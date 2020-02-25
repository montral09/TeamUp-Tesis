﻿using System;

namespace backend.Logic.Entities
{
    public class Message : PublicationQuestion, IComparable<Message>
    {
        public int IdPublication { get; set; }
        public string PublicationTitle { get; set; }
        public bool IsMyPublication { get; set; }

        public Message() { }

        public Message(int idPublication, string publicationTitle, bool isMyPublication, int idQuestion, string name, string question, string creationDate, Answer answer) : base (idQuestion, name, question, creationDate, answer)
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

        public int CompareTo(Message other)
        {
            if (other.CreationDate.Equals(CreationDate)) {
                if (other.Answer == null)
                {
                    return 1;
                } else if (Answer ==  null)
                {
                    return -1;
                } else
                {
                    return 0;
                }
            }
            else
            {
                return CreationDate.CompareTo(CreationDate);
            }
        }
    }
}