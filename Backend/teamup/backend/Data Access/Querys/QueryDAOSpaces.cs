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
                " videoURL, hourPrice, dailyPrice, weeklyPrice, monthlyPrice, availability, facilities, state, city)" +
                " output INSERTED.idPublication VALUES(@idUser, @spaceType, getdate(), @title, @description, @address, @locationLat, @locationLong, @capacity, " +
                " @videoURL, @hourPrice, @dailyPrice, @weeklyPrice, @monthlyPrice, @availability, @facilities, 1, @city)";
            return query;
        }

        public String GetPublicationsPendingApproval()
        {
            String query = "select p.idPublication, p.idUser, u.name, u.lastName, u.mail, u.phone, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city from PUBLICATIONS p, USERS u where " +
                "p.idUser = u.idUser and p.state = 1";
            return query;
        }

        public String GetPublisherSpaces()
        {
            String query = "select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city, e.description as state from PUBLICATIONS p, USERS u, SPACE_STATES e where " +
                "p.idUser = u.idUser and u.mail= @mail and p.state = e.idSpaceState";
            return query;
        }

        public String GetSpace()
        {
            String query = "select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, " +
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city, p.totalViews from PUBLICATIONS p where " +
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
            if (!String.IsNullOrEmpty(voGetPublicationsFilter.City))
            {
                query.Append("and p.city = @city ");
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
            query = query.Append("select p.idPublication, u.name, u.lastName, u.mail, u.phone, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city, p.totalViews, s.individualRent from PUBLICATIONS p, Users u, SPACE_TYPES s where p.idUser = u.idUser and s.idSpaceType = p.spaceType ");
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
            if (!String.IsNullOrEmpty(voGetPublicationsFilter.City))
            {
                query.Append("and p.city = @city ");
            }
            if (voGetPublicationsFilter.Facilities != null && voGetPublicationsFilter.Facilities.Count != 0)
            {
                foreach(var facility in voGetPublicationsFilter.Facilities)
                {
                    query.Append("and CHARINDEX(CAST(").Append(facility).Append(" AS VARCHAR)").Append(", p.facilities) > 0 ");   
                }
                
            }
            query.Append("order by p.idPublication offset ").Append((voGetPublicationsFilter.PageNumber) * maxPublicationsPage).Append(" rows fetch next ").Append(maxPublicationsPage).Append(" rows only ");
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
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city, p.totalViews from PUBLICATIONS p where " +
                " p.idPublication <> @idPublication and p.state = 2 and p.capacity >= @capacity and p.spaceType = @spaceType and p.city = @city";
            return query;
        }

        public String GetPublisherMailFromPublication()
        {
            String query = "select u.mail, p.title, u.idUser, p.creationDate, u.name from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and u.idUser = p.idUser";
            return query;
        }

        public String AddFavorite()
        {
            String query = "insert into FAVOURITE_SPACES(idPublication, idUser) values (@idPublication, @idUser)";
            return query;
        }

        public String DeleteFavorite()
        {
            String query = "delete from FAVOURITE_SPACES where idPublication = @idPublication and idUser =  @idUser";
            return query;
        }
        public String DeleteAllImages()
        {
            String query = "delete from PUBLICATION_IMAGES where idPublication = @idPublication";
            return query;
        }

        public String UpdatePublication()
        {
            String query = "update PUBLICATIONS set spaceType = @spaceType, title = @title, description = @description, " +
                "address = @address, locationLat = @locationLat, locationLong = @locationLong, capacity = @capacity, " +
                "videoURL = @videoURL, hourPrice = @hourPrice, dailyPrice = @dailyPrice, weeklyPrice = @weeklyPrice, " +
                "monthlyPrice = @monthlyPrice, availability = @availability, facilities = @facilities, city = @city where idPublication = @idPublication";
            return query;            
        }

        public String DeleteImages(string currentImagesURL)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("delete from PUBLICATION_IMAGES where idPublication = @idPublication and accessURL not in('");
            query.Append(currentImagesURL);
            query.Append("')");
            return query.ToString();
        }

        public String AddOneVisit()
        {
            String query = "update PUBLICATIONS set totalViews = totalViews + 1 where idPublication = @idPublication";
            return query;
        }

        public String CreateReservation()
        {
            String query = "insert into RESERVATIONS (idPublication, idCustomer, planSelected, dateFrom, hourFrom, HourTo," +
                " people, comment, totalPrice, state) VALUES (@idPublication, @idCustomer, @planSelected, @dateFrom, @hourFrom, @HourTo," +
                " @people, @comment, @totalPrice, 1)";
            return query;
        }

        public String GetPublisherByPublication()
        {
            String query = "select u.idUser, u.mail, u.name, u.lastName, u.checkPublisher, u.mailValidated, u.publisherValidated, u.active " +
                "from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and u.idUser = p.idUser";
            return query;
        }

        public String GetReservations(long idCustomer, long idPublisher)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("select p.title, r.idReservation, r.idPublication, r.idCustomer, r.planSelected, r.reservedQty, r.dateFrom, r.hourFrom, r.HourTo," +
                " r.people, r.comment, r.totalPrice, r.state, rs.description from RESERVATIONS r, PUBLICATIONS p, USERS u, RESERVATION_STATES rs where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and rs.idReservationState = r.state ");
            if (idCustomer != 0)
            {
                query.Append("and r.idCustomer = @idCustomer ");
            } else if (idPublisher != 0)
            {
                query.Append("and p.idUser = u.idUser and u.idUser = @idPublisher");
            }
            return query.ToString();
        }

        public String GetPublicationsPublisher ()
        {
            string query = "select idPublication from PUBLICATIONS where idUser = @idUser";
            return query;
        }

        public String UdpdateStateReservation(string canceledReason)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update RESERVATIONS set state = @state");
            if (canceledReason != null)
            {
                query.Append(",canceledReason = @canceledReason");
            }
            query.Append(" where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetUsersByReservation()
        {
            String query = "select u1.mail as cMail, u1.name as cName, u2.mail as pMail, u2.name as pName " +
                "from USERS u1, USERS u2, PUBLICATIONS p, RESERVATIONS r where r.idReservation = @idReservation and p.idPublication = r.idPublication and u1.idUser = r.idCustomer and u2.idUser = p.idUser";
            return query;
        }

        public String UpdateReservation()
        {           
            String query = "update RESERVATIONS set dateFrom = @dateFrom, hourFrom = @hourFrom, hourTo = @hourTo, totalPrice = @totalPrice " +
                "where idReservation = @idReservation and state in (1, 2, 3)";
            return query;
        }

        public String GetQuantityReserved()
        {
            String query = "select count(idReservation) as quantity from RESERVATIONS where idPublication = @idPublication";
            return query;
        }
    }
     
}
