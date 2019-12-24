using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetMessages : VOResponse
    {

        public List<VOMessage> Messages { get; set; }

        public VOResponseGetMessages() { }
        public VOResponseGetMessages(List<VOMessage> messages)
        {
            Messages = messages;
        }
    }
}
