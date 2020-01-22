using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Data_Access.VO.Requests;
using backend.Logic;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Data_Access
{
    interface IDAOSpaces
    {
        List<VOSpaceType> GetSpaceTypes();
        List<VOReservationType> GetReservationTypes();
        List<VOFacility> GetFacilities();
        Task<Dictionary<string, string>> CreatePublicationAsync(VORequestCreatePublication voCreatePublication, User user);
        List<VOPublicationAdmin> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval);
        List<VOPublication> GetPublisherSpaces(string mail);
        VOPublication GetSpace(int idSpace, User user, bool addVisit);
        VOPublicationAdmin UpdateStatePublication(int idPublication, string rejectedreason, int newCodeState, bool isAdmin);
        VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter);
        bool IsFavourite(int idPublication, long idUser);
        List<VOPublication> GetRelatedSpaces(int idPublication, int capacity, int spaceType, string city);
        void UpdateFavorite(VORequestUpdateFavorite voUpdateFavorite, long idUser);
        Task<Dictionary<string, string>> UpdatePublication(VORequestUpdatePublication voUpdatePublication, User user);
        void CreateReservation(VORequestCreateReservation voCreateReservation, User user, int idPlan);
        List<VOReservationExtended> GetReservationsCustomer(VORequestGetReservationsCustomer voGetReservationsCustomer, long idCustomer);
        List<VOReservationExtended> GetReservationsPublisher(VORequestGetReservationsPublisher voGetReservationsPublisher, long idPublisher);
        UsersReservationBasicData UpdateStateReservation(int idReservation, string canceledReason, int newCodeState, string newDescriptionState, DateTime dateTo);
        UsersReservationBasicData UpdateReservation(VORequestUpdateReservation voUpdateRservation);
        void CreateReview(VORequestCreateReview voCreateReview, long idUser);
        void CreatePublicationQuestion(VORequestCreatePublicationQuestion voCreatePublicationQuestion, long idUser);
        User CreatePublicationAnswer(VORequestCreatePublicationAnswer voCreatePublicationAnswer);
        List<VOPublicationQuestion> GetPublicationQuestions(int idPublication);
        List<VOPublicationPlan> GetPublicationPlans();
        Task UpdatePreferentialPayment(VORequestUpdatePreferentialPayment voUpdatePayment);
        Task<UserBasicData> PayReservationCustomer(VORequestPayReservationCustomer voPayReservationCustomer, long idUser);
        Task PayReservationPublisher(VORequestPayReservationPublisher voPayReservationPublisher, long idUser);
        UserBasicData UpdatePaymentCustomer(VORequestUpdatePaymentCustomer voUpdatePayment);
        List<VOPublicationPaymentAdmin> GetPublicationPlanPayments();
        List<VOCommissionPaymentAdmin> GetCommissionPaymentsAdmin();
        List<VOPublication> GetFavorites(long idUser);
        List<VOSpaceTypeRecommended> GetRecommendedPublications();
        UserBasicData UpdatePreferentialPaymentAdmin(VORequestUpdatePreferentialPaymentAdmin voUpdatePayment);
        UserBasicData UpdatePaymentCommissionAdmin(VORequestUpdatePaymentCommissionAdmin voUpdatePayment);
        List<VOMessage> GetMessages(VORequestGetMessages voGetMessages, bool isPublisher, long idUser);
        string GetPublicationPlanById(int idPlan);
        User GetPublisherByPublication(int idPublication);
        string GetPublicationTitleByQuestionId(int idQuestion);
        string GetPublicationTitleByReservationId(int idReservation);
        UsersReservationBasicData GetUsersReservationBasicData(int idReservation);
        void UpdateCommissionAmountAdmin(VORequestUpdateCommissionAmountAdmin voUpdateAmount);
        void CreatePublicationStatics(VORequestCreatePublicationStatics voCreatePublicationStatics);
        string GetReservationPlanDescriptionEmail(int idPlan, int language, bool plural);
        int GetReservationPlanByDescription(string desc);
        List<VOReservationExtended> GetReservations();
    }
}
