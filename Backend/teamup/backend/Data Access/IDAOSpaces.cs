﻿using backend.Data_Access.VO;
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
        Task CreatePublicationAsync(VORequestCreatePublication voCreatePublication, User user);
        List<VOPublicationAdmin> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval);
        List<VOPublication> GetPublisherSpaces(string mail);
        VOPublication GetSpace(int idSpace);
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
    }
}
