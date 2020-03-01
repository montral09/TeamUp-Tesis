using backend.Logic;
using System;

namespace backend.Data_Access
{
    public interface IDAOUtil
    {
        String ValidAccessToken(String accessToken, String mail);
        String ValidRefreshToken(String refreshToken, String mail);
        EmailDataGeneric GetEmailDataGeneric(String code, int language);
        int ConvertStatePublication(string state);
        int ConvertStateReservation(string state);
    }
}
