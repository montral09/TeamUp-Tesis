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
using backend.Data_Access.VO.Responses;

namespace webapi.Controllers
{
    public class ReservationPaymentPublisherController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationPaymentPublisher")]
        public async Task<IHttpActionResult> Post([FromBody]VORequestPayReservationPublisher voPayReservationPublisher)
        {
            try
            {
                VOResponsePayReservationPublisher voResp = new VOResponsePayReservationPublisher();
                voResp = await fach.PayReservationPublisher(voPayReservationPublisher);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}