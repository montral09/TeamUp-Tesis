using backend.Logic;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access
{
    public class DAOUtil : IDAOUtil
    {
        public string ValidAccessToken(string accessToken, string mail)
        {
            return EnumMessages.OK.ToString();
        }

        public string ValidRefreshToken(string refreshToken, string mail)
        {
            return EnumMessages.OK.ToString();
        }
    }
}
