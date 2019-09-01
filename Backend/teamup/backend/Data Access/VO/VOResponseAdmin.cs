using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseAdmin : VOResponse
    {
        public VOUser voUser;

        public VOResponseAdmin() { }
        public VOResponseAdmin(VOUser voUser)
        {
            this.voUser = voUser;
        }
    }
}
