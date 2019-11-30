using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;
using System.Threading.Tasks;

namespace webapi.Controllers
{
    public class ReservationController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservation")]
        public IHttpActionResult Post([FromBody]VORequestCreateReservation voCreateReservation)
        {
            try
            {
                VOResponseCreateReservation voResp = new VOResponseCreateReservation();

                voResp = fach.CreateReservation(voCreateReservation);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/reservation")]
        public IHttpActionResult Put([FromBody]VORequestUpdateStateReservation voUpdateStateReservation)
        {
            try
            {
                VOResponseUpdateStateReservation voResp = new VOResponseUpdateStateReservation();

                voResp = fach.UpdateStateReservation(voUpdateStateReservation);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        } 
    }
}