using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Collections.Generic;
using backend.Data_Access.VO.Data;
using backend.Exceptions;

namespace webapi.Controllers
{
    //[Authorize]
    public class CustomerController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/customer")]
        public IHttpActionResult Get()
        {
            try
            {
                VOResponseGetCustomers voResp = new VOResponseGetCustomers();
                List<VOCustomer> customers = fach.GetCustomers();
                voResp.responseCode = EnumMessages.SUCC_CUSTOMERSOK.ToString();
                voResp.voCustomers = customers;
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/customer")]
        public IHttpActionResult Put([FromBody]VORequestRequestPublisher voRequest)
        {
            try
            {
                VOResponseRequestPublisher voResp = new VOResponseRequestPublisher();
                fach.RequestPublisher(voRequest.Mail);
                voResp.responseCode = EnumMessages.SUCC_USRUPDATED.ToString();
                return Ok(voResp);

            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

    }
}