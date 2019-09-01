using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Collections.Generic;

namespace webapi.Controllers
{
    public class CustomerController : ApiController
    {
        IFachadaWeb fach = new FabricaFachadas().CrearFachadaWEB;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/customer")]
        public IHttpActionResult Get()
        {
            try
            {               
                VOResponseGetUsers voResp = new VOResponseGetUsers();
                List<VOUser> customers = fach.GetCustomers();
                voResp.responseCode = EnumMessages.SUCC_CUSTOMERSOK.ToString();
                voResp.voUsers = customers;
                return Ok(voResp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }

    }
}