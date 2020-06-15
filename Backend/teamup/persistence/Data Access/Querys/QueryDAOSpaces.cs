using backend.Logic;
using System;
using System.Collections.Generic;
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

        public String GetFacilities()
        {
            String query = "select idFacility, description, icon from FACILITIES";
            return query;
        }

        public String CreatePublication()
        {
            StringBuilder query = new StringBuilder();
            query.Append("insert into PUBLICATIONS (idUser, spaceType, creationDate, title, description, address, locationLat, locationLong, ");
            query.Append("capacity, videoURL, hourPrice, dailyPrice, weeklyPrice, monthlyPrice, availability, state, city, expirationDate) ");
            query.Append("output INSERTED.idPublication VALUES(@idUser, @spaceType, getdate(), @title, @description, @address, ");
            query.Append("@locationLat, @locationLong, @capacity, @videoURL, @hourPrice, @dailyPrice, @weeklyPrice, ");
            query.Append("@monthlyPrice, @availability, 1, @city, @expirationDate)");
            return query.ToString();
        }

        public String GetPublicationsPendingApproval()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.idUser, u.name, u.lastName, u.mail, u.phone, p.spaceType, p.creationDate, ");
            query.Append("p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, p.videoURL, ");
            query.Append("p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.city ");
            query.Append("from PUBLICATIONS p, USERS u where p.idUser = u.idUser and p.state = 1");
            return query.ToString();
        }

        public String GetPublisherSpaces()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, ");
            query.Append("p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.city, ");
            query.Append("e.description as state, p.idPlan, p.totalViews, p.expirationDate from PUBLICATIONS p, USERS u, SPACE_STATES e where ");
            query.Append("p.idUser = u.idUser and u.mail= @mail and p.state = e.idSpaceState order by p.idPublication desc");
            return query.ToString();
        }

        public String GetSpace()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, ");
            query.Append("p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.city, p.totalViews, ");
            query.Append("s.individualRent, p.idUser, p.expirationDate from PUBLICATIONS p, SPACE_TYPES s where p.idPublication = @idPublication and ");
            query.Append("p.state = 2 and s.idSpaceType = p.spaceType");
            return query.ToString();
        }

        public String UdpdateStatePublication(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update PUBLICATIONS set state = @state");
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

        public String GetQuantityPublicationsWithFilter(int state, int spaceType, int capacity, List<int> facilities,
            string city, int pageNumber, int publicationsPerPage)
        {
            StringBuilder query = new StringBuilder();
            query.Append("select count(p.idPublication) as quantity from PUBLICATIONS p  ");
            if (facilities != null && facilities.Count != 0)
            {
                query.Append(", PUBLICATION_FACILITIES pf ");
            }
            query.Append("where p.creationDate is not null ");
            if (state != 0)
            {
                query.Append("and p.state = @state ");
            }
            if (spaceType != 0)
            {
                query.Append("and p.spaceType = @spaceType ");
            }
            if (capacity != 0)
            {
                query.Append("and p.capacity >= @capacity ");
            }
            if (!String.IsNullOrEmpty(city))
            {
                query.Append("and p.city = @city ");
            }
            if (facilities != null && facilities.Count != 0)
            {
                string facilitiesChain = Util.CreateFacilitiesString(facilities);
                query.Append("and pf.idFacility in (").Append(facilitiesChain).Append(") and pf.idPublication = p.idPublication group by p.idPublication having count(distinct pf.idFacility) = ").Append(facilities.Count);

            }
            return query.ToString();
        }

        public String GetPublicationsWithFilter(List<int> facilities, int spaceType, int capacity, string city, int maxPublicationsPage, int state)
        {
            StringBuilder query = new StringBuilder();
            string selectColumns = "p.idPublication, u.name, u.lastName, u.mail, u.phone, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.city, p.totalViews, p.expirationDate, s.individualRent, ss.description as spaceStateDescription ";
            query.Append("select ");
            query.Append(selectColumns).Append("from PUBLICATIONS p,  Users u, SPACE_TYPES s, SPACE_STATES ss ");
            if (facilities != null && facilities.Count != 0)
            {
                query.Append(", PUBLICATION_FACILITIES pf ");
            }
            query.Append("where p.idUser = u.idUser and s.idSpaceType = p.spaceType and p.state = ss.idSpaceState ");
            if (state != 0)
            {
                query.Append("and p.state = @state ");
            }
            if (spaceType != 0)
            {
                query.Append("and p.spaceType = @spaceType ");
            }
            if (capacity != 0)
            {
                query.Append("and p.capacity >= @capacity ");
            }
            if (!String.IsNullOrEmpty(city))
            {
                query.Append("and p.city = @city ");
            }
            if (facilities != null && facilities.Count != 0)
            {
                string facilitiesChain = Util.CreateFacilitiesString(facilities);
                query.Append("and pf.idFacility in (").Append(facilitiesChain).Append(")  and pf.idPublication = p.idPublication group by ").Append(selectColumns).Append("having count(distinct pf.idFacility) = ").Append(facilities.Count);

            }
            // query.Append(" order by p.idPublication offset ").Append((voGetPublicationsFilter.PageNumber) * maxPublicationsPage).Append(" rows fetch next ").Append(maxPublicationsPage).Append(" rows only ");
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
            query.Append("select u.mail, u.name, rr.rating, rr.review, r.idReservation from reservation_reviews rr, reservations r, publications p, ");
            query.Append("USERS u where rr.idReservation = r.idReservation and r.idPublication = p.idPublication and ");
            query.Append("p.idPublication = @idPublication and u.idUser = rr.idUser");
            return query.ToString();
        }

        public String GetRelatedSpaces()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, ");
            query.Append("p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.city, p.totalViews ");
            query.Append("from PUBLICATIONS p where p.idPublication <> @idPublication and p.state = 2 and p.capacity >= @capacity and ");
            query.Append("p.spaceType = @spaceType and p.city = @city");
            return query.ToString();
        }

        public String GetPublisherMailFromPublication()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u.mail, p.title, u.idUser, p.creationDate, u.name from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and ");
            query.Append("u.idUser = p.idUser");
            return query.ToString();
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
            StringBuilder query = new StringBuilder();
            query.Append("update PUBLICATIONS set spaceType = @spaceType, title = @title, description = @description, address = @address, ");
            query.Append("locationLat = @locationLat, locationLong = @locationLong, capacity = @capacity, videoURL = @videoURL, ");
            query.Append("hourPrice = @hourPrice, dailyPrice = @dailyPrice, weeklyPrice = @weeklyPrice, monthlyPrice = @monthlyPrice, ");
            query.Append("availability = @availability, city = @city where idPublication = @idPublication");
            return query.ToString();
        }

        public String DeleteImages(string currentImagesURL)
        {
            StringBuilder query = new StringBuilder();
            query.Append("delete from PUBLICATION_IMAGES where idPublication = @idPublication and accessURL not in('");
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
            StringBuilder query = new StringBuilder();
            query.Append("insert into RESERVATIONS (idPublication, idCustomer, planSelected, reservedQty, dateFrom, hourFrom, HourTo, ");
            query.Append("people, comment, totalPrice, state, commission) VALUES (@idPublication, @idCustomer, @planSelected, @reservedQty, ");
            query.Append("@dateFrom, @hourFrom, @HourTo, @people, @comment, @totalPrice, 1, @commission)");
            return query.ToString();
        }

        public String GetPublisherByPublication()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u.idUser, u.mail, u.name, u.lastName, u.checkPublisher, u.mailValidated, u.publisherValidated, u.active, u.language ");
            query.Append("from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and u.idUser = p.idUser");
            return query.ToString();
        }

        public String GetReservations(long idCustomer, long idPublisher)
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.title, r.idReservation, r.idPublication, r.idCustomer, rp.description as planSelected, r.reservedQty, r.dateFrom, ");
            query.Append("r.dateTo, r.hourFrom, r.HourTo, r.people, r.comment, r.totalPrice, r.state, rs.description, s.individualRent, ");
            query.Append("p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, r.paymentCustomerState, ps.description as customerPaymentDesc, ");
            query.Append("u.name, u.mail from RESERVATIONS r, PUBLICATIONS p, RESERVATION_STATES rs, SPACE_TYPES s, PAYMENT_STATES ps, RESERVATION_PLANS rp ");
            if (idCustomer != 0)
            {
                query.Append(", USERS U where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and rs.idReservationState = r.state ");
                query.Append("and p.spaceType = s.idSpaceType and r.planSelected = rp.idReservationPlan and r.idCustomer = @idCustomer and ");
                query.Append("ps.idPaymentState = paymentCustomerState and u.idUser = r.idCustomer order by r.idReservation desc");
            }
            else if (idPublisher != 0)
            {
                query.Append(", USERS u2, USERS u where r.idPublication = p.idPublication and r.dateFrom > DATEADD(month, -6, GETDATE()) and ");
                query.Append("rs.idReservationState = r.state and p.spaceType = s.idSpaceType and r.planSelected = rp.idReservationPlan and ");
                query.Append("p.idUser = u2.idUser and u2.idUser = @idPublisher and ps.idPaymentState = paymentCustomerState and r.idCustomer = u.idUser ");
                query.Append("order by r.idReservation desc");
            }
            return query.ToString();
        }

        public String GetPublicationsPublisher()
        {
            string query = "select idPublication from PUBLICATIONS where idUser = @idUser";
            return query;
        }

        public String UdpdateStateReservation(string canceledReason)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update RESERVATIONS set state = @state, dateTo = @dateTo ");
            if (canceledReason != null)
            {
                query.Append(",canceledReason = @canceledReason ");
            }
            query.Append("where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetUsersByReservation()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u1.mail as cMail, u1.name as cName, u1.language as cLanguage, u2.mail as pMail, u2.name as pName, u2.language as pLanguage, ");
            query.Append("r.planSelected from USERS u1, USERS u2, PUBLICATIONS p, RESERVATIONS r where r.idReservation = @idReservation and ");
            query.Append("p.idPublication = r.idPublication and u1.idUser = r.idCustomer and u2.idUser = p.idUser");
            return query.ToString();
        }

        public String UpdateReservation()
        {
            StringBuilder query = new StringBuilder();
            query.Append("update RESERVATIONS set reservedQty = @reservedQty, dateFrom = @dateFrom, hourFrom = @hourFrom, hourTo = @hourTo, ");
            query.Append("totalPrice = @totalPrice, people = @people where idReservation = @idReservation and state in (1, 2, 3)");
            return query.ToString();
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
            StringBuilder query = new StringBuilder();
            query.Append("select TOP 30 q.idQuestion, u.name, q.question, q.creationDate from PUBLICATION_QUESTIONS q, USERS u where ");
            query.Append("q.idPublication = @idPublication and q.idUser = u.idUser order by q.creationDate desc");
            return query.ToString();
        }

        public String GetAnswers()
        {
            String query = "select a.answer, a.creationDate from PUBLICATION_ANSWERS a where a.idQuestion = @idQuestion order by a.creationDate desc";
            return query;
        }

        public String GetReviewReservation()
        {
            String query = "select r.idReview from RESERVATION_REVIEWS r where r.idReservation = @idReservation";
            return query;
        }

        public String GetQuestionsWithoutAnswer()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select count(q.idQuestion) as qty from PUBLICATION_QUESTIONS q left join PUBLICATION_ANSWERS a ");
            query.Append("on a.idQuestion = q.idQuestion where q.idPublication = @idPublication and a.idQuestion is null");
            return query.ToString();
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

        public String UpdatePreferentialPayment(string comment, string url)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update PREFERENTIAL_PAYMENTS set state = 2, paymentDate = getdate()");
            if (comment != null)
            {
                query.Append(",comment = @comment");
            }
            if (url != null)
            {
                query.Append(",evidence = @evidence");
            }
            query.Append(" where idPrefPayments = @idPrefPayments");
            return query.ToString();
        }

        public String UpdatePreferentialPaymentAdmin(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update PREFERENTIAL_PAYMENTS set state = @state ");
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
            StringBuilder query = new StringBuilder();
            query.Append("select pp.idPlan, ppl.name as planDescription, pp.state, ps.description as paymentDescription, ppl.price, p.planPrice, ");
            query.Append("pp.paymentDate, pp.comment, pp.evidence from PAYMENT_STATES ps, PUBLICATIONS p, PREFERENTIAL_PAYMENTS pp, PUBLICATION_PLANS ppl ");
            query.Append("where p.idPublication = @idPublication and pp.idPlan = ppl.idPlan and pp.idPublication = p.idPublication and pp.state = ps.idPaymentState");
            return query.ToString();
        }

        public String GetPublicationPlanById()
        {
            String query = "select name from PUBLICATION_PLANS where idPlan = @idPlan";
            return query;
        }

        public String PayReservationCustomer(string comment, string url)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update RESERVATIONS set paymentCustomerState = 2");
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
            StringBuilder query = new StringBuilder();
            query.Append("select u.name, u.lastName, u.mail, u.language from USERS u, RESERVATIONS r, PUBLICATIONS p ");
            query.Append("where r.idReservation = @idReservation and r.idPublication = p.idPublication and p.idUser = u.idUser");
            return query.ToString();
        }

        public String PayReservationPublisher(string comment, string url)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update RESERVATIONS set commissionPaymentState = 2");
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
            query.Append("update RESERVATIONS set paymentCustomerState = @paymentCustomerState ");
            if (rejectedReason != null)
            {
                query.Append(", paymentCustomerRejectedReason = @paymentCustomerRejectedReason ");
            }
            query.Append("where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetCustomerFromReservation()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u.name, u.lastName, u.mail, u.language from USERS u, RESERVATIONS r where r.idReservation = @idReservation and ");
            query.Append("r.idCustomer = u.idUser");
            return query.ToString();
        }

        public String GetPublicationPlanPayments()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.title, u.mail, u.name, u.lastName, u.phone, ppl.name as planName, ps.description, p.planPrice, ");
            query.Append("pp.comment, pp.evidence, pp.paymentDate from PUBLICATIONS p, USERS u, PUBLICATION_PLANS ppl, PREFERENTIAL_PAYMENTS pp, ");
            query.Append("PAYMENT_STATES ps where pp.idPublication = p.idPublication and p.idUser = u.idUser and ppl.idPlan = pp.idPlan and ");
            query.Append("pp.state = ps.idPaymentState and (pp.state = 1 or pp.state = 2 or pp.state = 3) order by pp.paymentDate desc");
            return query.ToString();

        }

        public String ApproveCommissionPaymentPublisher()
        {
            StringBuilder query = new StringBuilder();
            query.Append("update RESERVATIONS set commissionPaymentState = 3");
            query.Append(" where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetCommissionPaymentsAdmin()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select r.idReservation, p.title, u.mail, u.name, u.lastName, u.phone, r.commission, ps.description, r.commissionComment, ");
            query.Append("r.commissionEvidence, r.paymentCommissionDate from RESERVATIONS r, PUBLICATIONS p, USERS u, PAYMENT_STATES ps where ");
            query.Append("(r.commissionPaymentState = 1 or r.commissionPaymentState = 2 or r.commissionPaymentState = 3) and ");
            query.Append("r.commissionPaymentState = ps.idPaymentState and r.idPublication = p.idPublication and p.idUser = u.idUser");
            return query.ToString();
        }

        public String GetReservationPaymentInfo()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select r.paymentCustomerState, ps.description, r.paymentCustomerComment, r.paymentCustomerEvidence, r.paymentCustomerDate ");
            query.Append("from RESERVATIONS r, PAYMENT_STATES ps where r.idReservation = @idReservation and r.paymentCustomerState = ps.idPaymentState");
            return query.ToString();
        }

        public String GetCommissionPayment()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select r.commission, r.commissionPaymentState, ps.description, r.commissionComment, r.commissionEvidence, r.paymentCommissionDate ");
            query.Append("from RESERVATIONS r, PAYMENT_STATES ps where r.idReservation = @idReservation and r.commissionPaymentState = ps.idPaymentState");
            return query.ToString();
        }

        public String CancelPaymentReservation()
        {
            String query = "update RESERVATIONS set paymentCustomerState = 4, commissionPaymentState = 4 where idReservation = @idReservation";
            return query;
        }

        public String GetFavorites()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.spaceType, p.title, p.city, p.address, p.capacity, p.hourPrice, p.dailyPrice, p.weeklyPrice, ");
            query.Append("p.monthlyPrice from PUBLICATIONS p, FAVOURITE_SPACES fs where fs.idUser = @idUser and fs.idPublication = p.idPublication and p.state = 2");
            return query.ToString();
        }

        public String GetPublicationsRecommended()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.title, p.address, p.city, p.capacity from PUBLICATIONS p, PREFERENTIAL_PAYMENTS pp where p.state = 2 and ");
            query.Append("p.spaceType = @spaceType and pp.idPublication = p.idPublication and pp.idPlan = @idPlan and pp.state = 3");
            return query.ToString();
        }

        public String GetPublicationsRecommendedFree()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.title, p.address, p.city, p.capacity from PUBLICATIONS p LEFT JOIN PREFERENTIAL_PAYMENTS pp ON ");
            query.Append("pp.idPublication = p.idPublication where pp.idPublication IS NULL and p.state = 2 and p.spaceType = @spaceType");
            return query.ToString();
        }

        public String GetPublisherFromPublication()
        {
            String query = "select u.name, u.lastName, u.mail, u.language from USERS u, PUBLICATIONS p where p.idPublication = @idPublication and p.idUser = u.idUser";
            return query;
        }

        public String UpdatePaymentCommissionAdmin(string rejectedReason)
        {
            StringBuilder query = new StringBuilder();
            query.Append("update RESERVATIONS set commissionPaymentState = @commissionPaymentState ");
            if (rejectedReason != null)
            {
                query.Append(", paymentCommissionRejectedReason = @paymentCommissionRejectedReason ");
            }
            query.Append("where idReservation = @idReservation");
            return query.ToString();
        }

        public String GetQuestionsByCustomer()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select q.idQuestion, u.name, q.question, q.creationDate, p.idPublication, p.title from PUBLICATION_QUESTIONS q, ");
            query.Append("PUBLICATIONS p, USERS u where q.idUser = @idUser and p.idPublication = q.idPublication and p.state = 2 and ");
            query.Append("u.idUser = q.idUser order by q.creationDate desc");
            return query.ToString();
        }

        public String GetQuestionsByPublication()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select q.idQuestion, u.name, q.question, q.creationDate, p.idPublication, p.title from PUBLICATION_QUESTIONS q, PUBLICATIONS p, USERS u  ");
            query.Append("where q.idPublication = @idPublication and q.idPublication = p.idPublication and p.state = 2 and u.idUser = q.idUser order by q.creationDate desc");
            return query.ToString();
        }

        public String GetUserByQuestion()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u.idUser, u.mail, u.name, u.lastName, u.checkPublisher, u.mailValidated, u.publisherValidated, u.active, u.language from ");
            query.Append("PUBLICATION_QUESTIONS p, USERS u where p.idQuestion = @idQuestion and p.idUser = u.idUser");
            return query.ToString();
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

        public String UpdateCommissionAmountAdmin(bool isPaid)
        {
            String query = "";
            if (isPaid)
            {
                query = "update RESERVATIONS set commission = @commission, paymentCommissionDate = getdate(), commissionPaymentState = 3 where idReservation = @idReservation";
            }
            else
            {
                query = "update RESERVATIONS set commission = @commission where idReservation = @idReservation";
            }
            return query;
        }

        public String GetReservationPlanByDescription()
        {
            String query = "select idReservationPlan from RESERVATION_PLANS where description = @description";
            return query;
        }
        public String GetReservationPlanDescription()
        {
            String query = "select description from RESERVATION_PLANS_TRANSLATIONS where idPlan = @idPlan and language = @language and plural = @plural";
            return query;
        }

        public String InsertFacility()
        {
            String query = "insert into publication_facilities (idPublication, idFacility) values (@idPublication, @idFacility)";
            return query;
        }

        public String DeleteFacilities()
        {
            String query = "delete from PUBLICATION_FACILITIES where idPublication = @idPublication";
            return query;
        }

        public String GetFacilitiesPublication()
        {
            String query = "select idFacility from PUBLICATION_FACILITIES where idPublication = @idPublication";
            return query;
        }

        public String GetPreferentialPlan()
        {
            String query = "select idPlan from PREFERENTIAL_PAYMENTS where idPublication = @idPublication";
            return query;
        }

        public String GetDaysLeftPublication()
        {
            String query = "SELECT DATEDIFF(DAY, getdate(), p.expirationDate) as daysLeft from publications p where p.idPublication = @idPublication";
            return query;
        }

        public String UpdatePreferentialPlanUpgraded()
        {
            StringBuilder query = new StringBuilder();
            query.Append("update PREFERENTIAL_PAYMENTS set idPlan = @idPlan, state = 1, paymentDate = null, comment = null, evidence = null, ");
            query.Append("paymentRejectedReason = null where idPublication = @idPublication");
            return query.ToString();
        }

        public String SetPreferentialPlanPrice()
        {
            String query = "update PUBLICATIONS set idPlan = @idPlan, planPrice = @price where idPublication = @idPublication";
            return query;
        }

        public String GetPriceByPlanId()
        {
            String query = "select price from PUBLICATION_PLANS where idPlan = @idPlan";
            return query;
        }

        public String DeletePreferentialPlan()
        {
            String query = "delete from PREFERENTIAL_PAYMENTS where idPublication = @idPublication";
            return query;
        }

        public String IsRecommended()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select pp.idPublication from PREFERENTIAL_PAYMENTS pp, PUBLICATION_PLANS ppl, PUBLICATION_PLAN_TYPES ppt where pp.idPublication = @idPublication and ");
            query.Append("pp.idPlan = ppl.idPlan and ppl.idPlan = ppt.idPlan and ppt.idPlan = 4");
            return query.ToString();
        }

        public String GetPublicationInfoAfterUpdate()
        {
            String query = "select p.availability, p.expirationDate, p.planPrice from PUBLICATIONS p";
            return query;
        }

        public String GetAllReservations()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.title, r.idReservation, r.idPublication, r.idCustomer, rp.description as planSelected, r.reservedQty, r.dateFrom, r.dateTo, ");
            query.Append("r.hourFrom, r.HourTo, r.people, r.totalPrice, r.state, rs.description, r.paymentCustomerState, ps.description as customerPaymentDesc, ");
            query.Append("u1.mail as customerMail, u2.mail as publisherMail from RESERVATIONS r, PUBLICATIONS p, RESERVATION_STATES rs, SPACE_TYPES s, ");
            query.Append("PAYMENT_STATES ps, RESERVATION_PLANS rp, USERS u1, USERS u2 where r.idPublication = p.idPublication and rs.idReservationState = r.state and ");
            query.Append("p.spaceType = s.idSpaceType and r.planSelected = rp.idReservationPlan and u1.idUser = r.idCustomer and p.idUser = u2.idUser and ");
            query.Append("ps.idPaymentState = paymentCustomerState order by r.idReservation desc");
            return query.ToString();
        }

        public String FinishPublications()
        {
            String query = "update PUBLICATIONS set state = 5 OUTPUT INSERTED.idPublication where DATEDIFF(day, getdate(), expirationDate) < 0 and (state = 2 or state = 3 or state = 4)";
            return query;
        }

        public String GetPublicationNameMail()
        {
            String query = "select u.name, u.mail, u.language, p.title from PUBLICATIONS p, USERS u where idPublication = @idPublication and u.iduser = p.idUser";
            return query;
        }

        public String FinishReservations()
        {
            String query = "update RESERVATIONS set state = 4 OUTPUT INSERTED.idReservation where DATEDIFF(day, getdate(), dateTo) < 0 and (state = 2 or state = 3)";
            return query;
        }

        public String GetReservationNameMail()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select u1.name as customerName, u1.mail as customerMail, u1.language as customerLanguage, u2.name as publisherName, ");
            query.Append("u2.mail as publisherMail, u2.language as publisherLanguage, p.title from PUBLICATIONS p, RESERVATIONS r, USERS u1, ");
            query.Append("USERS u2 where r.idReservation = @idReservation and r.idCustomer = u1.idUser and r.idPublication = p.idPublication and p.iduser = u2.idUser");
            return query.ToString();
        }

        public String StartReservation()
        {
            String query = "update RESERVATIONS set state = 3 where dateFrom > getDate() and state = 2";
            return query;
        }

        public String IsPublicationActiveOrRejected()
        {
            String query = "select idSpaceState from SPACE_STATES where idSpaceState = @state and (idSpaceState = 2 or idSpaceState = 6 or idSpaceState = 4)";
            return query;
        }

        public String CreateChildPublication()
        {
            String query = "insert into OTHER_CONFIGURATION_PUBLICATIONS(idPublication, idChildPublication) values (@idPublication, @idChildPublication)";
            return query;
        }

        public String CreatePreferentialPaymentInherited()
        {
            StringBuilder query = new StringBuilder();
            query.Append("insert into PREFERENTIAL_PAYMENTS(idPublication, idPlan, state) values ");
            query.Append("(@idPublication, @idPlan, (select state from PREFERENTIAL_PAYMENTS where idPublication = @idParentPublication))");
            return query.ToString();
        }

        public String GetChildPublications()
        {
            String query = "select idChildPublication from OTHER_CONFIGURATION_PUBLICATIONS where idPublication = @idPublication";
            return query;
        }

        public String GetPublicationPlanApproved()
        {
            String query = "select idPrefPayments from PREFERENTIAL_PAYMENTS where idPublication = @idParentPublication and state = 3";
            return query;
        }

        public String IsChildPublication()
        {
            String query = "select idPublication from OTHER_CONFIGURATION_PUBLICATIONS where idChildPublication = @idChildPublication";
            return query;
        }

        public String GetIdChildPublicationConfig()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select idChildPublication from other_configuration_publications where ");
            query.Append("idPublication = @idPublication");
            return query.ToString();
        }

        public String GetIdParentPublicationConfig()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select idPublication from other_configuration_publications where ");
            query.Append("idChildPublication = @idChildPublication");
            return query.ToString();
        }

        public String GetOtherPublicationConfig()
        {
            StringBuilder query = new StringBuilder();
            query.Append("select p.idPublication, p.spaceType, p.creationDate, p.title, p.description, p.address, p.locationLat, p.locationLong, ");
            query.Append("p.capacity, p.videoURL, p.hourPrice, p.dailyPrice, p.weeklyPrice, p.monthlyPrice, p.availability, p.city, p.totalViews ");
            query.Append("from PUBLICATIONS p where p.idPublication = @idPublication and p.state = 2");
            return query.ToString();
        }
    }
}
