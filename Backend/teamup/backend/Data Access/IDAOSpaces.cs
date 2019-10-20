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
        Task CreatePublication(VORequestCreatePublication voCreatePublication, User user);
        List<VOPublicationAdmin> GetPublicationsPendingApproval(VORequestPublicationPendindApproval voPublicationPendingApproval);
        List<VOPublication> GetPublisherSpaces(string mail);
        VOPublication GetSpace(int idSpace);
        void UpdateStatePublication(int idPublication, int newCodeState);
    }
}
