using backend.Logic;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Requests;
using backend.Data_Access.VO.Responses;

namespace webapi.Controllers
{
    public class ReservationAdminController : ApiController
    {
        IFacade fach = Facade.Instance;        
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationAdmin")]
        public IHttpActionResult Post([FromBody]VORequestGetReservations voGetReservations)
        {
            try
            {
                VOResponseGetReservations voResp = new VOResponseGetReservations();
                voResp = fach.GetReservations(voGetReservations);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}