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

        public String GetReservationTypes()
        {
            String query = "select idReservationType, description from RESERVATION_TYPES";
            return query;
        }

        public String GetFacilities()
        {
            String query = "select idFacility, description from FACILITIES";
            return query;
        }

        public String CreatePublication()
        {
            String query = "insert into PUBLICATIONS (idUser, spaceType, creationDate, title, description, locationLat, locationLong, capacity," +
                " videoURL, hourPrice, dailyPrice, weeklyPrice, monthlyPrice, availability, facilities, state, publicationValidated)" +
                " output INSERTED.idPublication VALUES(@idUser, @spaceType, getdate(), @title, @description, @locationLat, @locationLong, @capacity, " +
                " @videoURL, @hourPrice, @dailyPrice, @weeklyPrice, @monthlyPrice, @availability, @facilities, @state, 0)";
            return query;
        }

        public String GetPublicationsPendingApproval()
        {
            String query = "select p.idPublication, p.idUser, u.name, u.lastName, u.mail, u.phone, p.spaceType, p.creationDate, p.title, p.description, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities from PUBLICATIONS p, USERS u where " +
                "p.idUser = u.idUser and p.publicationValidated = 0";
                return query;
        }

    }
     
}
