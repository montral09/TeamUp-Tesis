using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetUserData : VOResponse
    {
        public VOPublisher User { get; set; }

        public VOResponseGetUserData() { }
        public VOResponseGetUserData(VOPublisher user)
        {
            User = user;
        }
    }
}
