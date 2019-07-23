using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseLogin : VOResponse
    {
        public VOUserLogin vouserLog;

        public VOResponseLogin() { }
        public VOResponseLogin(VOUserLogin vouser)
        {
            this.vouserLog = vouser;
        }
    }
}
