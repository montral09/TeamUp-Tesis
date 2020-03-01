using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;

namespace webapi.Controllers
{

    public class CustomerController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/customer")]
        public IHttpActionResult Put([FromBody]VORequestRequestPublisher voRequest)
        {
            try
            {
                VOResponseRequestPublisher voResp = new VOResponseRequestPublisher();
                voResp = fach.RequestPublisher(voRequest);
                return Ok(voResp);

            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

    }
}