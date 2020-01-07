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
            String query = "select idFacility, description, icon from FACILITIES";
            return query;
        }

        public String CreatePublication()
        {
            String query = "insert into PUBLICATIONS (idUser, spaceType, creationDate, title, description, address, locationLat, locationLong, capacity," +
                " videoURL, hourPrice, dailyPrice, weeklyPrice, monthlyPrice, availability, facilities, state, city, expirationDate)" +
                " output INSERTED.idPublication VALUES(@idUser, @spaceType, getdate(), @title, @description, @address, @locationLat, @locationLong, @capacity, " +
                " @videoURL, @hourPrice, @dailyPrice, @weeklyPrice, @monthlyPrice, @availability, @facilities, 1, @city, @expirationDate)";
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
                "p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.facilities, p.city, e.description as state, p.idPlan, p.totalViews from PUBLICATIONS p, USERS u, SPACE_STATES e where " +
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
                " people, comment, totalPrice, state, commission) VALUES (@idPublication, @idCustomer, @planSelected, @dateFrom, @hourFrom, @HourTo," +
                " @people, @comment, @totalPrice, 1, @commission)";
            return query;
        }

        public String GetPublisherByPublication()
        {
            String query = "select u.idUser, u.mail, u.name, u.lastName, u.checkPublisher, u.mailValidated, u.publisherValidated, u.active, u.language " +
                "from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and u.idUser = p.idUser";
            return query;
        }

        public String GetReservations(long idCustomer, long idPublisher)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("select p.title, r.idReservation, r.idPublication, r.idCustomer, r.planSelected, r.reservedQty, r.dateFrom, r.hourFrom, r.HourTo," +
                " r.people, r.comment, r.totalPrice, r.state, rs.description, s.individualRent, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, r.paymentCustomerState, ps.description as customerPaymentDesc, u.name from RESERVATIONS r, PUBLICATIONS p, RESERVATION_STATES rs, SPACE_TYPES s, PAYMENT_STATES ps");
            if (idCustomer != 0)
            {
                query.Append(" , USERS U where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and rs.idReservationState = r.state and p.spaceType = s.idSpaceType and r.idCustomer = @idCustomer and ps.idPaymentState = paymentCustomerState and u.idUser = r.idCustomer order by r.idReservation desc");
            } else if (idPublisher != 0)
            {
                query.Append(", USERS u where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and rs.idReservationState = r.state and p.spaceType = s.idSpaceType and p.idUser = u.idUser and u.idUser = @idPublisher and ps.idPaymentState = paymentCustomerState order by r.idReservation desc");
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
            String query = "select u1.mail as cMail, u1.name as cName, u1.language as cLanguage, u2.mail as pMail, u2.name as pName, u2.language as pLanguage " +
                "from USERS u1, USERS u2, PUBLICATIONS p, RESERVATIONS r where r.idReservation = @idReservation and p.idPublication = r.idPublication and u1.idUser = r.idCustomer and u2.idUser = p.idUser";
            return query;
        }

        public String UpdateReservation()
        {           
            String query = "update RESERVATIONS set dateFrom = @dateFrom, hourFrom = @hourFrom, hourTo = @hourTo, totalPrice = @totalPrice, people = @people " +
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
            String query = "select TOP 30 q.idQuestion, u.name, q.question, q.creationDate from PUBLICATION_QUESTIONS q, USERS u where " +
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

        public String GetPublicationPlans()
        {
            String query = "select idPlan, name, price, days from PUBLICATION_PLANS";
            return query;            
        }

        public String GetDaysPlan()
        {
            String query = "select days from PUBLICATION_PLANS where idPlan = @idPlan";
            return query;
        }

        public String CreatePreferentialPayment()
        {
            String query = "insert into PREFERENTIAL_PAYMENTS(idPublication, idPlan, state) values (@idPublication, @idPlan, 1)";
            return query;
        }

        public String GetIdPreferentialPayment()
        {
            String query = "select idPrefPayments from PREFERENTIAL_PAYMENTS where idPublication = @idPublication";
            return query;
        }
        
        public String UpdatePreferentialPayment(string comment, string url, int idPlan)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update PREFERENTIAL_PAYMENTS set idPlan = @idPlan, state = 2");
            if (comment != null)
            {
                query.Append(",comment = @comment");
            }
            if (url != null)
            {
                query.Append(",evidence = @evidence");
            }
            if (idPlan == 2)
            {
                query.Append(",paymentDate = getdate()");
            }
            query.Append(" where idPrefPayments = @idPrefPayments");
            return query.ToString();
        }

        public String UpdatePreferentialPaymentAdmin(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update PREFERENTIAL_PAYMENTS set state = @state ");
            if (rejectedReason != null)
            {
                query.Append(", paymentRejectedReason = @paymentRejectedReason ");
            }
            query.Append("where idPrefPayments = @idPrefPayments");
            return query.ToString();           
        }

        public String UpdatePublicationDueToPayment()
        {
            String query = "update PUBLICATIONS set idPlan = @idPlan, expirationDate = @expirationDate where idPublication = @idPublication";
            return query;
        }

        public String GetIdPreferentialPlan()
        {
            String query = "select idPlan from PREFERENTIAL_PAYMENTS where idPrefPayments = @idPrefPayments";
            return query;
        }

        public String GetPreferentialPlanInfo()
        {
            String query = "select pp.idPlan, ppl.name as planDescription, pp.state, ps.description as paymentDescription, ppl.price, pp.paymentDate, pp.comment, pp.evidence from PAYMENT_STATES ps, PUBLICATIONS p, PREFERENTIAL_PAYMENTS pp, PUBLICATION_PLANS ppl where p.idPublication = @idPublication and " +
                "pp.idPlan = ppl.idPlan and pp.idPublication = p.idPublication and pp.state = ps.idPaymentState";
            return query;
        }

        public String GetPublicationPlanById()
        {
            String query = "select name from PUBLICATION_PLANS where idPlan = @idPlan";
            return query;
        }

        public String PayReservationCustomer(string comment, string url)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update RESERVATIONS set paymentCustomerState = 2");
            if (comment != null)
            {
                query.Append(",paymentCustomerComment = @comment");
            }
            if (url != null)
            {
                query.Append(",paymentCustomerEvidence = @evidence");
            }
            query.Append(",paymentCustomerDate = getdate()");
           
            query.Append(" where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetPublisherFromReservation()
        {
            String query = "select u.name, u.lastName, u.mail, u.language from USERS u, RESERVATIONS r, PUBLICATIONS p " +
                "where r.idReservation = @idReservation and r.idPublication = p.idPublication and p.idUser = u.idUser";                
            return query;
        }

        public String PayReservationPublisher(string comment, string url)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update RESERVATIONS set commissionPaymentState = 2");
            if (comment != null)
            {
                query.Append(",commissionComment = @comment");
            }
            if (url != null)
            {
                query.Append(",commissionEvidence = @evidence");
            }
            query.Append(",paymentCommissionDate = getdate()");

            query.Append(" where idReservation = @idReservation");
            return query.ToString();
        }

        public String UpdatePaymentCustomer(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update RESERVATIONS set paymentCustomerState = @paymentCustomerState ");
            if (rejectedReason != null) {
                query.Append(", paymentCustomerRejectedReason = @paymentCustomerRejectedReason ");
            }
            query.Append("where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetCustomerFromReservation()
        {
            String query = "select u.name, u.lastName, u.mail, u.language from USERS u, RESERVATIONS r " +
                "where r.idReservation = @idReservation and r.idCustomer = u.idUser";
            return query;
        }

        public String GetPublicationPlanPayments()
        {
            String query = "select p.idPublication, p.title, u.mail, u.name, u.lastName, u.phone, ppl.name as planName, ps.description, " +
                "ppl.price, pp.comment, pp.evidence, pp.paymentDate from PUBLICATIONS p, USERS u, PUBLICATION_PLANS ppl, PREFERENTIAL_PAYMENTS pp, " +
                "PAYMENT_STATES ps where pp.idPublication = p.idPublication and p.idUser = u.idUser and " +
                "ppl.idPlan = pp.idPlan and pp.state = ps.idPaymentState and pp.state = 2 order by pp.paymentDate desc";
            return query;

        }

        public String ApproveCommissionPaymentPublisher()
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update RESERVATIONS set commissionPaymentState = 3");
            query.Append(" where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetCommissionPaymentsAdmin()
        {
            String query = "select r.idReservation, p.title, u.mail, u.name, u.lastName, u.phone, r.commission, ps.description, " +
                "r.commissionComment, r.commissionEvidence, r.paymentCommissionDate from RESERVATIONS r, PUBLICATIONS p, USERS u, " +
                "PAYMENT_STATES ps where (r.commissionPaymentState = 2 or r.commissionPaymentState = 1) and r.commissionPaymentState = ps.idPaymentState and r.idPublication = p.idPublication and p.idUser = u.idUser ";
            return query;
        }

        public String GetReservationPaymentInfo()
        {
            String query = "select r.paymentCustomerState, ps.description, r.paymentCustomerComment, r.paymentCustomerEvidence, r.paymentCustomerDate " +
                "from RESERVATIONS r, PAYMENT_STATES ps where r.idReservation = @idReservation and r.paymentCustomerState = ps.idPaymentState";
            return query;
        }

        public String GetCommissionPayment()
        {
            String query = "select r.commission, r.commissionPaymentState, ps.description, r.commissionComment, r.commissionEvidence, r.paymentCommissionDate " +
                "from RESERVATIONS r, PAYMENT_STATES ps where r.idReservation = @idReservation and r.commissionPaymentState = ps.idPaymentState";
            return query;
        }

        public String CancelPaymentReservation()
        {
            String query = "update RESERVATIONS set paymentCustomerState = 4, commissionPaymentState = 4 where idReservation = @idReservation";
            return query;
        }

        public String GetFavorites()
        {
            String query = "select p.idPublication, p.spaceType, p.title, p.city, p.address, p.capacity, p.hourPrice, p.dailyPrice, " +
                "p.weeklyPrice, p.monthlyPrice from PUBLICATIONS p, FAVOURITE_SPACES fs where fs.idUser = @idUser and fs.idPublication = p.idPublication and " +
                "p.state = 2 ";
            return query;
        }

        public String GetPublicationsRecommended()
        {
            String query = "select p.idPublication, p.title, p.address, p.city, p.capacity from PUBLICATIONS p, PREFERENTIAL_PAYMENTS pp " +
                "where p.state = 2 and p.spaceType = @spaceType and pp.idPublication = p.idPublication and pp.idPlan = @idPlan and pp.state = 3";
            return query;
        }

        public String GetPublicationsRecommendedFree()
        {
            String query = "select p.idPublication, p.title, p.address, p.city, p.capacity from PUBLICATIONS p " +
                "LEFT JOIN PREFERENTIAL_PAYMENTS pp ON pp.idPublication = p.idPublication where pp.idPublication IS NULL and p.state = 2 and p.spaceType = @spaceType";
            return query;
        }

        public String GetPublisherFromPublication()
        {
            String query = "select u.name, u.lastName, u.mail, u.language from USERS u, PUBLICATIONS p " +
                "where p.idPublication = @idPublication and p.idUser = u.idUser";
            return query;
        }

        public String UpdatePaymentCommissionAdmin(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query = query.Append("update RESERVATIONS set commissionPaymentState = @commissionPaymentState ");
            if (rejectedReason != null)
            {
                query.Append(", paymentCommissionRejectedReason = @paymentCommissionRejectedReason ");
            }
            query.Append("where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetQuestionsByCustomer()
        {
            String query = "select q.idQuestion, u.name, q.question, q.creationDate, p.idPublication, p.title from PUBLICATION_QUESTIONS q, PUBLICATIONS p, USERS u where " +
                "q.idUser = @idUser and p.idPublication = q.idPublication and p.state = 2 and u.idUser = q.idUser order by q.creationDate desc";
            return query;
        }

        public String GetQuestionsByPublication()
        {
            String query = "select q.idQuestion, u.name, q.question, q.creationDate, p.idPublication, p.title from PUBLICATION_QUESTIONS q, PUBLICATIONS p, USERS u where " +
                "q.idPublication = @idPublication and q.idPublication = p.idPublication and p.state = 2 and u.idUser = q.idUser order by q.creationDate desc";
            return query;
        }

        public String GetUserByQuestion()
        {
            String query = "select u.idUser, u.mail, u.name, u.lastName, u.checkPublisher, u.mailValidated, u.publisherValidated, u.active, u.language from PUBLICATION_QUESTIONS p, USERS u where p.idQuestion = @idQuestion and p.idUser = u.idUser";
            return query;
        }

        public String GetPublicationByQuestionId()
        {
            String query = "select p.title from PUBLICATIONS p, PUBLICATION_QUESTIONS q where q.idPublication = p.idPublication and q.idQuestion = @idQuestion";
            return query;
        }

        public String GetPublicationTitleByReservationId()
        {
            String query = "select p.title from PUBLICATIONS p, RESERVATIONS r where r.idReservation = @idReservation and r.idPublication = p.idPublication";
            return query;
        }

        public String GetFreePlan()
        {
            String query = "select pt.idPlan FROM PUBLICATION_PLAN_TYPES pt, PUBLICATION_PLANS pp where pp.idPlan = @idPlan and pt.idPlan = pp.idPlan and pt.idPlan = 1";
            return query;
        }

        public String UpdateCommissionAmountAdmin (bool isPaid)
        {
            String query = "";
            if (isPaid)
            {
                query = "update RESERVATIONS set commission = @commission, paymentCommissionDate = getdate(), commissionPaymentState = 3 where idReservation = @idReservation";
            } else
            {
                query = "update RESERVATIONS set commission = @commission where idReservation = @idReservation";
            }
            return query;
        }

        public String CreatePublicationStatics()
        {
            String query = "insert into publications_statistics (spaceType, facilities, idPublication, favourite, rented) values (@spaceType, @facilities, @idPublication, @favourite, @rented)";
            return query;
        }
    }
}
