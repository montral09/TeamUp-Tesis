using backend.Data_Access.VO.Data;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class PublisherToVOPublisherConverter
    {
        public static VOPublisher Convert(Publisher user)
        {
            VOPublisher voPublisher = new VOPublisher
            {
                IdUser = user.IdUser,
                Mail = user.Mail,
                Password = user.Password,
                Name = user.Name,
                LastName = user.LastName,
                Phone = user.Phone,
                Active = user.Active,
                Language = user.LanguageDescription,
                CheckPublisher = user.CheckPublisher,
                Rut = user.Rut,
                RazonSocial = user.RazonSocial,
                Address = user.Address,
                PublisherValidated = user.PublisherValidated,
                MailValidated = user.MailValidated
            };
            return voPublisher;
        }

        public static List<VOPublisher> Convert(List<Publisher> users)
        {
            List<VOPublisher> voUsers = new List<VOPublisher>();
            if (users != null && users.Count != 0)
            {
                foreach (var user in users)
                {
                    voUsers.Add(Convert(user));
                }
            }
            return voUsers;
        }
    }
}
