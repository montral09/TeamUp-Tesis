using System;

namespace backend.Data_Access.Query
{
    public class QueryDAOSpaces
    {
        public String GetSpacesTypes()
        {
            String query = "select idSpaceType, description from SPACE_TYPES";
            return query;
        }

        public String GetLocations()
        {
            String query = "select idLocation, description from LOCATIONS";
            return query;
        }

    }
     
}
