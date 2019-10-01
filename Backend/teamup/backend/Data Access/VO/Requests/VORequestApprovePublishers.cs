using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestApprovePublishers
    {
        public List<String> Mails { get; set; }

        public VORequestApprovePublishers(List<String> mails)
        {
            Mails = mails;
        }
    }
}

