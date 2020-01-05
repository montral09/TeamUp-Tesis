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
    public class ReservationPaymentAdminController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationPaymentAdmin")]
        public IHttpActionResult Post([FromBody]VORequestUpdateCommissionAmountAdmin voUpdateAmount)
        {
            try
            {
                VOResponseUpdateCommissionAmountAdmin voResp = new VOResponseUpdateCommissionAmountAdmin();
                voResp = fach.UpdateCommissionAmountAdmin(voUpdateAmount);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/reservationPaymentAdmin")]
        public IHttpActionResult Put([FromBody]VORequestUpdatePaymentCommissionAdmin voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePaymentCommissionAdmin voResp = new VOResponseUpdatePaymentCommissionAdmin();
                voResp = fach.UpdatePaymentCommissionAdmin(voUpdatePayment);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }        
    }
}