using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access
{
    interface IDAOUtil
    {
        String ValidAccessToken(String accessToken, String mail);
        String ValidRefreshToken(String refreshToken, String mail);
    }
}
