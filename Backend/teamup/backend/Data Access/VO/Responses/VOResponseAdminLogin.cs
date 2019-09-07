using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseAdminLogin : VOResponse
    {
        public VOAdmin voAdmin;

        public VOResponseAdminLogin() { }
        public VOResponseAdminLogin(VOAdmin voAdmin)
        {
            this.voAdmin = voAdmin;
        }
    }
}
