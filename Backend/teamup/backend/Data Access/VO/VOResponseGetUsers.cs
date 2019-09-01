using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetUsers : VOResponse
    {
        public List<VOUser> voUsers;

        public VOResponseGetUsers() { }
        public VOResponseGetUsers(List<VOUser> voUsers)
        {
            this.voUsers = voUsers;
        }
    }
}
