using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class AnswerToVOAnswerConverter
    {
        public static VOAnswer Convert(Answer answer)
        {
            if (answer != null)
            {
                VOAnswer voAnswer = new VOAnswer
                {
                    Answer = answer.AnswerText,
                    CreationDate = answer.CreationDate,
                };
                return voAnswer;
            } else
            {
                return null;
            } 
            
        }

        public static List<VOAnswer> Convert(List<Answer> answers)
        {
            List<VOAnswer> voAnswers = new List<VOAnswer>();
            if (answers != null && answers.Count != 0)
            {
                foreach (var answer in answers)
                {
                    voAnswers.Add(Convert(answer));
                }
            }
            return voAnswers;
        }
    }
}
