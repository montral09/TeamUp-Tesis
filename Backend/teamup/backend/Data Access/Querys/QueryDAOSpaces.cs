using backend.Data_Access.VO;
using System;
using System.Text;

namespace backend.Data_Access.Query
{
    public class QueryDAOSpaces
    {
        public String GetSpacesTypes()
        {
            String query = "select idSpaceType, description, individualRent from SPACE_TYPES";
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
            String query = "insert into PUBLICATIONS (idUser, spaceType, creationDate, title, description, address, locationLat, locationLong, capacity," +
                " videoURL, hourPrice, dailyPrice, weeklyPrice, monthlyPrice, availability, facilities, state)" +
                " output INSERTED.idPublication VALUES(@idUser, @spaceType, getdate(), @title, @description, @address, @locationLat, @locationLong, @capacity, " +
                " @videoURL, @hourPrice, @dailyPrice, @weeklyPrice, @monthlyPrice, @availability, @facilities, 1)";
            return query;
        }

        public String GetPublicationsPendingApproval()
        {
            String query = "select p.idPublication, p.idUser, u.name, u.lastName, u.mail, u.phone, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities from PUBLICATIONS p, USERS u where " +
                "p.idUser = u.idUser and p.state = 1";
            return query;
        }

        public String GetPublisherSpaces()
        {
            String query = "select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, e.description as state from PUBLICATIONS p, USERS u, SPACE_STATES e where " +
                "p.idUser = u.idUser and u.mail= @mail and p.state = e.idSpaceState";
            return query;
        }

        public String GetSpace()
        {
            String query = "select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities from PUBLICATIONS p where " +
                " p.idPublication = @idPublication and p.state = 2";
            return query;
        }

        public String UdpdateStatePublication(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update PUBLICATIONS set state = @state");
            if (rejectedReason != null)
            {
                query.Append(",rejectedReason = @rejectedReason");
            }
            query.Append(" where idPublication = @idPublication");
            return query.ToString();
        }

        public String InsertImage()
        {
            String query = "insert into publication_images (idPublication, accessURL) values (@idPublication, @accessURL)";
            return query;
        }

        public String GetImages()
        {
            String query = "select accessURL from PUBLICATION_IMAGES where idPublication=@idPublication";
            return query;
        }

        public String GetQuantityPublicationsWithFilter(VORequestGetPublicationsWithFilters voGetPublicationsFilter, int state)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("select count(p.idPublication) as quantity from PUBLICATIONS p where p.creationDate is not null ");
            if (state != 0)
            {
                query.Append("and p.state = @state ");
            }
            if (voGetPublicationsFilter.SpaceType != 0)
            {
                query.Append("and p.spaceType = @spaceType ");
            }
            if (voGetPublicationsFilter.Capacity != 0)
            {
                query.Append("and p.capacity >= @capacity ");
            }
            if (voGetPublicationsFilter.Facilities != null && voGetPublicationsFilter.Facilities.Count != 0)
            {
                foreach (var facility in voGetPublicationsFilter.Facilities)
                {
                    query.Append("and CHARINDEX(CAST(").Append(facility).Append(" AS VARCHAR)").Append(", p.facilities) > 0 ");
                }

            }            
            return query.ToString();
        }
        
        public String GetPublicationsWithFilter(VORequestGetPublicationsWithFilters voGetPublicationsFilter, int maxPublicationsPage, int state)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities from PUBLICATIONS p where p.creationDate is not null ");
            if (state != 0)
            {
                query.Append("and p.state = @state ");
            }
            if (voGetPublicationsFilter.SpaceType != 0)
            {
                query.Append("and p.spaceType = @spaceType ");
            }
            if (voGetPublicationsFilter.Capacity != 0)
            {
                query.Append("and p.capacity >= @capacity ");
            }
            if (voGetPublicationsFilter.Facilities != null && voGetPublicationsFilter.Facilities.Count != 0)
            {
                foreach(var facility in voGetPublicationsFilter.Facilities)
                {
                    query.Append("and CHARINDEX(CAST(").Append(facility).Append(" AS VARCHAR)").Append(", p.facilities) > 0 ");   
                }
                
            }
            query.Append("order by p.idPublication offset ").Append((voGetPublicationsFilter.PageNumber - 1) * maxPublicationsPage).Append(" rows fetch next 10 rows only ");
            return query.ToString();
        }

        public String GetFavourite()
        {
            String query = "select idPublication from FAVOURITE_SPACES where idPublication=@idPublication and idUser = @idUser";
            return query;
        }

        public String GetReviews()
        {
            String query = "select p.idUser, u.name, p.rating, p.review from PUBLICATION_REVIEWS p, USERS u  where idPublication = @idPublication and u.idUser = p.idUser";
            return query;
        }

        public String GetRelatedSpaces ()
        {
            String query = "select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities from PUBLICATIONS p where " +
                " p.idPublication <> @idPublication and p.state = 2 and p.capacity >= @capacity and p.spaceType = @spaceType";
            return query;
        }

        public String GetPublisherMailFromPublication()
        {
            String query = "select u.mail, p.title, u.idUser, p.creationDate, u.name from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and u.idUser = p.idUser";
            return query;
        }
    }
     
}
