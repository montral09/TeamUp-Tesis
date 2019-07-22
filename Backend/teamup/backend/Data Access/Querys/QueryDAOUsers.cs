using System;

namespace backend.Data_Access.Query
{
    public class QueryDAOUsers
    {
        public String Member()
        {
            String query = "select idUser from USERS where mail=@mail";
            return query;
        }

        public String User()
        {
            String query = "select idUser,mail,name,lastName,password,phone,userType,rut,razonSocial from USERS where mail=@mail";
            return query;
        }
    }
}
