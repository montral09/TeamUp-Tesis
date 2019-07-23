using System;
using backend.Logic;

namespace backend.Data_Access.Query
{
    interface IDAOUsers
    {
        bool Member(String user);
        User Find(string mail);
    }
}
