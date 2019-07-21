using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOUserCreate
    {
        public String idUser { get; set; }
        public String mail { get; set; }
        public String password { get; set; }
        public String name { get; set; }
        public String lastName { get; set; }
        public String phone { get; set; }
        public String userType { get; set; }
        public String rut { get; set; }
        public String razonSocial { get; set; }

        public VOUserCreate(){}

    }
}
