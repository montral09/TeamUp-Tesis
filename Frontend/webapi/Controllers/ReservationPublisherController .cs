using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;
using System.Threading.Tasks;
using backend.Data_Access.VO.Requests;

namespace webapi.Controllers
{
    public class ReservationPublisherController : ApiController
    {
        IFacade fach = Facade.Instance;        
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationPublisher")]
        public IHttpActionResult Post([FromBody]VORequestGetReservationsPublisher voGetReservationsPublisher)
        {
            try
            {
                VOResponseGetReservationsPublisher voResp = new VOResponseGetReservationsPublisher();

                voResp = fach.GetReservationsPublisher(voGetReservationsPublisher);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}