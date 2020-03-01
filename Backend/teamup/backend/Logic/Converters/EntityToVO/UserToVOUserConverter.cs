using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class UserToVOUserConverter
    {
        public static VOUser Convert(User user)
        {
            VOUser voUser = new VOUser
            {
                Mail = user.Mail,
                Password = user.Password,
                Name = user.Name,
                LastName = user.LastName,
                Phone = user.Phone,
                Language = user.LanguageDescription,
            };
            return voUser;
        }

        public static List<VOUser> Convert(List<User> users)
        {
            List<VOUser> voUsers = new List<VOUser>();
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
