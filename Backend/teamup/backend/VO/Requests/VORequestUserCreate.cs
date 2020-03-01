using backend.Data_Access.VO.Data;
using System;

namespace backend.Data_Access.VO
{
    public class VORequestUserCreate : VOCustomer
    {
        public VORequestUserCreate(Int64 idUser, string mail,
            string password, string name, string lastName, string phone, bool active, string languageDescription, int languageCode,
            bool checkPublisher, string rut, string razonSocial, string address, bool mailValidated) : base(
               idUser, mail, password, name, lastName, phone, active, languageDescription, languageCode, checkPublisher, rut, razonSocial, address, mailValidated)
        {
        }
    }
}

