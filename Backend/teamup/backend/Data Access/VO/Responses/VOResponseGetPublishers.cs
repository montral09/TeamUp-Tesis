using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetPublishers : VOResponse
    {
        public List<VOUser> voUsers;

        public VOResponseGetPublishers() { }

        public VOResponseGetPublishers(List<VOUser> voUsers)
        {
            this.voUsers = voUsers;
        }
    }
}
