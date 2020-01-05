using System;

namespace backend.Logic
{
    public class EmailDataGeneric
    {
        
        public String Subject { get; set; }
        public String Body { get; set; }

        public EmailDataGeneric() { }

        public EmailDataGeneric(string subject, string body)
        {
            Subject = subject;
            Body = body;            
        }
    }
}
