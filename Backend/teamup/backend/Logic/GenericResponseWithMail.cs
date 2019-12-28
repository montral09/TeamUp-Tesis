using System;
using System.Collections.Generic;

namespace backend.Logic
{
    public class GenericResponseWithMail
    {
        public string Message { get; set; }
        public string Receiver { get; set; }
        public Dictionary<string, string> MailData = new Dictionary<string, string>();

        public GenericResponseWithMail() { }

        public GenericResponseWithMail(string message, string receiver, Dictionary<string, string> mailData)
        {
            Message = message;
            Receiver = receiver;
            MailData = mailData;            
        }       
    }
}
