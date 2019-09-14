using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseLogin : VOResponse
    {
        public VOUser voUserLog;
        public string token;

        public VOResponseLogin() { }
        public VOResponseLogin(VOUser voUser)
        {
            this.voUserLog = voUser;
        }
    }
}
