using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetPublishers : VOResponse
    {
        public List<VOPublisher> voUsers;

        public VOResponseGetPublishers() { }
        public VOResponseGetPublishers(List<VOPublisher> voUsers)
        {
            this.voUsers = voUsers;
        }
    }
}
