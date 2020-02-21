using backend.Data_Access.VO.Data;
using System.Collections.Generic;

namespace backend.Data_Access.VO
{
    public class VOResponseGetUsers : VOResponse
    {
        public List<VOPublisher> voUsers;

        public VOResponseGetUsers() { }
        public VOResponseGetUsers(List<VOPublisher> voUsers)
        {
            this.voUsers = voUsers;
        }
    }
}
