using backend.Data_Access.VO;
using backend.Logic.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Data_Access
{
    interface IDAOSpaces
    {
        List<SpaceType> GetSpaceTypes();
        List<Facility> GetFacilities();
        Task<Dictionary<string, string>> CreatePublicationAsync(Publication publication, User user, List<Image> images, List<String> imagesURL);
        List<Publication> GetPublicationsPendingApproval();
        List<Publication> GetPublisherSpaces(string mail);
        Publication GetSpace(int idSpace, User user, bool addVisit);
        Publication UpdateStatePublication(int idPublication, string rejectedreason, int newCodeState, bool isAdmin);
        Tuple<List<Publication>, int> GetPublicationsWithFilters(int spaceType, int capacity, List<int> facilities, string city, int pageNumber, string stateDescription, int publicationsPerPage);
        bool IsFavourite(int idPublication, long idUser);
        List<Publication> GetRelatedSpaces(int idPublication, int capacity, int spaceType, string city);
        void UpdateFavorite(int code, int idPublication, long idUser);
        Task<Dictionary<string, string>> UpdatePublication(Publication publication, List<Image> images, List<string> imagesURL, User user);
        void CreateReservation(Reservation reservation, User user, int idPlan);
        List<ReservationExtended> GetReservationsCustomer(string mail, long idCustomer);
        List<ReservationExtended> GetReservationsPublisher(long idPublisher);
        UsersReservationBasicData UpdateStateReservation(int idReservation, string canceledReason, int newCodeState, string newDescriptionState, DateTime dateTo);
        UsersReservationBasicData UpdateReservation(int idReservation, DateTime dateFrom, string hourFrom,
                        string hourTo, int totalPrice, int people, int reservedQuantit);
        void CreateReview(Review review, long idUser);
        void CreatePublicationQuestion(int idPublication, string question, long idUser);
        User CreatePublicationAnswer(int idQuestion, string answer);
        List<PublicationQuestion> GetPublicationQuestions(int idPublication);
        List<PublicationPlan> GetPublicationPlans();
        Task UpdatePreferentialPayment(int idPublicaton, string comment, Image evidence);
        Task<UserBasicData> PayReservationCustomer(int idReservation, string comment, Image evidence, long idUser);
        Task PayReservationPublisher(int idReservation, string comment, Image evidence, long idUser);
        UserBasicData UpdatePaymentCustomer(int idReservation, bool approved, string rejectedReason);
        List<PublicationPaymentAdmin> GetPublicationPlanPayments();
        List<CommissionPaymentAdmin> GetCommissionPaymentsAdmin();
        List<Publication> GetFavorites(long idUser);
        List<SpaceTypeRecommended> GetRecommendedPublications();
        UserBasicData UpdatePreferentialPaymentAdmin(int idPublication, bool approved, string rejectedReason);
        UserBasicData UpdatePaymentCommissionAdmin(int idReservation, bool approved, string rejectedReason);
        List<Message> GetMessages(bool isPublisher, long idUser);
        string GetPublicationPlanById(int idPlan);
        User GetPublisherByPublication(int idPublication);
        string GetPublicationTitleByQuestionId(int idQuestion);
        string GetPublicationTitleByReservationId(int idReservation);
        UsersReservationBasicData GetUsersReservationBasicData(int idReservation);
        void UpdateCommissionAmountAdmin(int idReservation, int price);
        string GetReservationPlanDescriptionEmail(int idPlan, int language, bool plural);
        int GetReservationPlanByDescription(string desc);
        List<ReservationExtended> GetReservations();
        List<EmailData> FinishPublications();
        List<EmailData> FinishReservations();
        void StartReservation();
        List<Publication> GetOtherPublicationConfig(int idPublication);
    }
}
