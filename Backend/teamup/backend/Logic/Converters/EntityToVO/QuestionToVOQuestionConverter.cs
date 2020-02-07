using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class QuestionToVOQuestionConverter
    {
        public static VOPublicationQuestion Convert(PublicationQuestion question)
        {
            VOPublicationQuestion voQuestion = new VOPublicationQuestion
            {
                IdQuestion = question.IdQuestion,
                Name = question.Name,
                Question = question.Question,
                CreationDate = question.CreationDate,
                Answer = AnswerToVOAnswerConverter.Convert(question.Answer),
            };
            return voQuestion;
        }

        public static List<VOPublicationQuestion> Convert(List<PublicationQuestion> questions)
        {
            List<VOPublicationQuestion> voQuestions = new List<VOPublicationQuestion>();
            foreach (var question in questions)
            {
            voQuestions.Add(Convert(question));
            }
            return voQuestions;
        }

    }
}
