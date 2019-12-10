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
    public class ReservationPaymentCustomerController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationPaymentCustomer")]
        public async Task<IHttpActionResult> Post([FromBody]VORequestPayReservationCustomer voPayReservationCustomer)
        {
            try
            {
                VOResponsePayReservationCustomer voResp = new VOResponsePayReservationCustomer();

                voResp = await fach.PayReservationCustomer(voPayReservationCustomer);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/reservationPaymentCustomer")]
        public IHttpActionResult Put([FromBody]VORequestApprovePaymentCustomer voApprovePayment)
        {
            try
            {
                VOResponseApprovePaymentCustomer voResp = new VOResponseApprovePaymentCustomer();
                voResp = fach.ApprovePaymentCustomer(voApprovePayment);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}