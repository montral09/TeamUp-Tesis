using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseUserCreate : VOResponse
    {
        public VOUser voUser;

        public VOResponseUserCreate() { }
        public VOResponseUserCreate(VOUser user)
        {
            this.voUser = user;
        }
    }
}
