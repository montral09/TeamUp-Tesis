using backend.Data_Access.VO.Data;
using System.Collections.Generic;

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
