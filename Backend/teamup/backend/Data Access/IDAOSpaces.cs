using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access
{
    public interface IDAOSpaces
    {
        List<VOSpaceType> GetSpaceTypes();
        List<VOLocation> GetLocations();
    }
}
