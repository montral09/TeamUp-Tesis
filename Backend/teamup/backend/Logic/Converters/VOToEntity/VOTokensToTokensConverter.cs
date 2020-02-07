using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOTokensToTokensConverter
    {
        public static Tokens Convert(VOTokens voTokens)
        {
            Tokens tokens = new Tokens
            {
                AccessToken = voTokens.AccessToken,
                RefreshToken = voTokens.RefreshToken,
            };
            return tokens;
        }
    }
}
