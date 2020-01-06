using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class PublicationStaticsController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publicationStatics")]
        public IHttpActionResult Post([FromBody]VORequestCreatePublicationStatics voCreatePublicationStatics)
        {
            try
            {
                VOResponseCreatePublicationStatics voResp = new VOResponseCreatePublicationStatics();
                voResp = fach.CreatePublicationStatics(voCreatePublicationStatics);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}