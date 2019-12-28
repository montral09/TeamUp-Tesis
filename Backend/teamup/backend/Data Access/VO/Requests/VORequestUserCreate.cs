using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VORequestUserCreate : VOUser
    {
        public VORequestUserCreate(String mail, String password, String name, String lastName, String phone, String rut, String razonSocial, String address, bool checkPublisher, bool publisherValidated, string language) 
            : base(mail, password, name, lastName, phone, rut, razonSocial, address, checkPublisher, publisherValidated, language)
        {
            CheckPublisher = checkPublisher;
        }
    }
}

