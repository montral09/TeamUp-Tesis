using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Requests;
using backend.Logic;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Data_Access
{
    interface IDAOSpaces
    {
        List<VOSpaceType> GetSpaceTypes();
        List<VOReservationType> GetReservationTypes();
        List<VOFacility> GetFacilities();
        Task<string> CreatePublicationAsync(VORequestCreatePublication voCreatePublication, User user);
        List<VOPublicationAdmin> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval);
        List<VOPublication> GetPublisherSpaces(string mail);
        VOPublication GetSpace(int idSpace, User user);
        VOPublicationAdmin UpdateStatePublication(int idPublication, string rejectedreason, int newCodeState, bool isAdmin);
        VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter);
        bool IsFavourite(int idPublication, long idUser);
        List<VOPublication> GetRelatedSpaces(int idPublication, int capacity, int spaceType, string city);
        void UpdateFavorite(VORequestUpdateFavorite voUpdateFavorite, long idUser);
        Task UpdatePublication(VORequestUpdatePublication voUpdatePublication, User user);
        void CreateReservation(VORequestCreateReservation voCreateReservation, User user);
        List<VOReservationExtended> GetReservationsCustomer(VORequestGetReservationsCustomer voGetReservationsCustomer, long idCustomer);
        List<VOReservationExtended> GetReservationsPublisher(VORequestGetReservationsPublisher voGetReservationsPublisher, long idPublisher);
        void UpdateStateReservation(int idReservation, string canceledReason, int newCodeState, string newDescriptionState, bool isAdmin);
        void UpdateReservation(VORequestUpdateReservation voUpdateRservation);
        void CreateReview(VORequestCreateReview voCreateReview, long idUser);
        void CreatePublicationQuestion(VORequestCreatePublicationQuestion voCreatePublicationQuestion, long idUser);
        void CreatePublicationAnswer(VORequestCreatePublicationAnswer voCreatePublicationAnswer, long idUser);
        List<VOPublicationQuestion> GetPublicationQuestions(int idPublication);
        List<VOPublicationPlan> GetPublicationPlans();
        Task UpdatePreferentialPayment(VORequestUpdatePreferentialPayment voUpdatePayment);
        Task PayReservationCustomer(VORequestPayReservationCustomer voPayReservationCustomer, long idUser);
        Task PayReservationPublisher(VORequestPayReservationPublisher voPayReservationPublisher, long idUser);
        void UpdatePaymentCustomer(VORequestUpdatePaymentCustomer voUpdatePayment);
        List<VOPublicationPaymentAdmin> GetPublicationPlanPayments();
        List<VOCommissionPaymentAdmin> GetCommissionPaymentsAdmin();
        List<VOPublication> GetFavorites(long idUser);
        List<VOSpaceTypeRecommended> GetRecommendedPublications();
        void UpdatePreferentialPaymentAdmin(VORequestUpdatePreferentialPaymentAdmin voUpdatePayment);
        void UpdatePaymentCommissionAdmin(VORequestUpdatePaymentCommissionAdmin voUpdatePayment);
        List<VOMessage> GetMessages(VORequestGetMessages voGetMessages, bool isPublisher, long idUser);
        string GetPublicationPlanById(int idPlan);
        User GetPublisherByPublication(int idPublication);
    }
}
