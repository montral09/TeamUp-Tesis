using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetUsers : VOResponse
    {
        public List<VOUserAdmin> voUsers;

        public VOResponseGetUsers() { }
        public VOResponseGetUsers(List<VOUserAdmin> voUsers)
        {
            this.voUsers = voUsers;
        }
    }
}
