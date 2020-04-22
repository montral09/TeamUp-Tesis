using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
using backend.Data_Access.VO.Requests;
using backend.Data_Access.VO.Responses;

namespace webapi.Controllers
{
    public class ReservationCustomerController : ApiController
    {
        IFacade fach = Facade.Instance;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationCustomer")]
        public IHttpActionResult Post([FromBody]VORequestGetReservationsCustomer voGetReservationsCustomer)
        {
            try
            {
                VOResponseGetReservationsCustomer voResp = new VOResponseGetReservationsCustomer();

                voResp = fach.GetReservationsCustomer(voGetReservationsCustomer);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/reservationCustomer")]
        public IHttpActionResult Put([FromBody]VORequestUpdateReservation voUpdateReservation)
        {
            try
            {
                VOResponseUpdateReservation voResp = new VOResponseUpdateReservation();
                voResp = fach.UpdateReservation(voUpdateReservation);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}