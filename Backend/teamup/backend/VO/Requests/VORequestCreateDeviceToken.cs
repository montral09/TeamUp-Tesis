using System;

namespace backend.Data_Access.VO
{
    public class VORequestCreateDeviceToken
    {
        public String Mail { get; set; }
        public String DeviceToken { get; set; }

        public VORequestCreateDeviceToken() { }
        public VORequestCreateDeviceToken(string mail, string deviceToken)
        {
            Mail = mail;
            DeviceToken = deviceToken;
        }
    }
}

