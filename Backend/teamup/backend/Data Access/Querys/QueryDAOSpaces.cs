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
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city, p.totalViews, s.individualRent, p.idUser from PUBLICATIONS p, SPACE_TYPES s where " +
                " p.idPublication = @idPublication and p.state = 2 and s.idSpaceType = p.spaceType";
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
            StringBuilder query = new StringBuilder();
            query = query.Append("select u.mail, u.name, rr.rating, rr.review, r.idReservation from reservation_reviews rr, reservations r, publications p, USERS u where ");
            query.Append("rr.idReservation = r.idReservation and r.idPublication = p.idPublication and ");
            query.Append("p.idPublication = @idPublication and u.idUser = rr.idUser");
            return query.ToString();
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
                " r.people, r.comment, r.totalPrice, r.state, rs.description, s.individualRent, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice from RESERVATIONS r, PUBLICATIONS p, RESERVATION_STATES rs, SPACE_TYPES s");
            if (idCustomer != 0)
            {
                query.Append(" where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and rs.idReservationState = r.state and p.spaceType = s.idSpaceType and r.idCustomer = @idCustomer");
            } else if (idPublisher != 0)
            {
                query.Append(", USERS u where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and rs.idReservationState = r.state and p.spaceType = s.idSpaceType and p.idUser = u.idUser and u.idUser = @idPublisher");
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

        public String CreateReview()
        {
            String query = "insert into RESERVATION_REVIEWS (idReservation, idUser, rating, review) VALUES (@idReservation, @idUser, @rating, @review)";
            return query;
        }

        public String CreateQuestion()
        {
            String query = "insert into PUBLICATION_QUESTIONS (idPublication, idUser, question, creationDate) VALUES (@idPublication, @idUser, @question, getdate())";
            return query;
        }

        public String CreateAnswer()
        {
            String query = "insert into PUBLICATION_ANSWERS (idQuestion, answer, creationDate) VALUES (@idQuestion, @answer, getdate())";
            return query;
        }

        public String GetPublicationQuestions()
        {
            String query = "select q.idQuestion, u.name, q.question, q.creationDate from PUBLICATION_QUESTIONS q, USERS u where " +
                "q.idPublication = @idPublication and q.idUser = u.idUser order by q.creationDate desc";
            return query;
        }

        public String GetAnswers()
        {
            String query = "select a.answer, a.creationDate from PUBLICATION_ANSWERS a where " +
                "a.idQuestion = @idQuestion order by a.creationDate desc";
            return query;
        }

        public String GetReviewReservation()
        {
            String query = "select r.idReview from RESERVATION_REVIEWS r where " +
                "r.idReservation = @idReservation";
            return query;
        }

        public String GetQuestionsWithoutAnswer()
        {
            String query = "select count(q.idQuestion) as qty from PUBLICATION_QUESTIONS q left join PUBLICATION_ANSWERS a " +
                "on a.idQuestion = q.idQuestion where q.idPublication = @idPublication and a.idQuestion is null";
                
            return query;
        }
    }
     
}
