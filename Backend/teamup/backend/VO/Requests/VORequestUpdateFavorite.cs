using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUpdateFavorite : VOTokens
    {
        public String Mail { get; set; }
        public int IdPublication { get; set; }
        public int Code { get; set; }

        public VORequestUpdateFavorite(string mail, int idPublication, int code, string accessToken) : base (accessToken)
        {
            Mail = mail;
            IdPublication = idPublication;
            Code = code;
        }
    }
}

