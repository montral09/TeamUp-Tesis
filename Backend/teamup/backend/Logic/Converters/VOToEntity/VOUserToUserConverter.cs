using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOUserToUserConverter
    {
        public static User Convert(VOUser voUser)
        {
            User user = new User
            {
                Mail = voUser.Mail,
                Password = voUser.Password,
                Name = voUser.Name,
                LastName = voUser.LastName,
                Phone = voUser.Phone,
                LanguageDescription = voUser.Language,
             };
             return user;
        }
    }
}
