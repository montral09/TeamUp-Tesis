﻿using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUserUpdate : VOUser
    {
        public String NewMail { get; set; }
        public String AccessToken { get; set; }

        public VORequestUserUpdate(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address, bool checkPublisher, bool publisherValidated, String newMail, String accessToken, string language) 
            : base(mail, password, name, lastName, phone, rut, razonSocial, address, checkPublisher, publisherValidated, language)
        {
            CheckPublisher = checkPublisher;
            NewMail = newMail;
            AccessToken = accessToken;
        }
    }
}
