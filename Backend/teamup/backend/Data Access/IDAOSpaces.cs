using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Logic;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Data_Access
{
    interface IDAOSpaces
    {
        List<VOSpaceType> GetSpaceTypes();
        List<VOLocation> GetLocations();
        List<VOReservationType> GetReservationTypes();
        List<VOFacility> GetFacilities();
        Task CreatePublicationAsync(VORequestCreatePublication voCreatePublication, User user);
        List<VOPublicationAdmin> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval);
        List<VOPublication> GetPublisherSpaces(string mail);
        VOPublication GetSpace(int idSpace);
        VOPublicationAdmin UpdateStatePublication(int idPublication, string rejectedreason, int newCodeState, bool isAdmin);
        VOResponseGetPublicationsWithFilters GetPublicationsWithFilters(VORequestGetPublicationsWithFilters voGetPublicationsFilter);
        bool IsFavourite(int idPublication, long idUser);
        List<VOPublication> GetRelatedSpaces(int idPublication, int capacity, int spaceType);
    }
}
