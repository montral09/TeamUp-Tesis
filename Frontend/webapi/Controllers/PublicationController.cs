using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace webapi.Controllers
{
    public class PublicationController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publication")]
        public IHttpActionResult Post([FromBody]VORequestCreatePublication voCreatePublication)
        {
            try
            {
                VOResponseCreatePublication voResp = new VOResponseCreatePublication();

                voResp = fach.CreatePublication(voCreatePublication);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}