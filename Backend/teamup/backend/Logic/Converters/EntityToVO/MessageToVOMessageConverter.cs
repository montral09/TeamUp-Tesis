using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class MessageToVOMessageConverter
    {
        public static VOMessage Convert(Message message)
        {
            VOMessage voMessage = new VOMessage
            {
                IdPublication = message.IdPublication,
                PublicationTitle = message.PublicationTitle,
                IsMyPublication = message.IsMyPublication,
                IdQuestion = message.IdQuestion,
                Name = message.Name,
                Question = message.Question,
                CreationDate = message.CreationDate,
                Answer = AnswerToVOAnswerConverter.Convert(message.Answer),
        };
            return voMessage;
        }

        public static List<VOMessage> Convert(List<Message> messages)
        {
            List<VOMessage> voMessages = new List<VOMessage>();
            if (messages != null && messages.Count != 0)
            {
                foreach (var message in messages)
                {
                    voMessages.Add(Convert(message));
                }
            }
            return voMessages;
        }
    }
}
