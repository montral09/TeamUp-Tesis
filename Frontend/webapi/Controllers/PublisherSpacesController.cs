using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;

namespace webapi.Controllers
{
    public class PublisherSpacesController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publisherSpaces")]
        public IHttpActionResult Post([FromBody]VORequestGetPublisherSpaces voRequestGetPublisherSpaces)
        {
            try
            {
                VOResponseGetPublisherSpaces voResp = new VOResponseGetPublisherSpaces();
                voResp = fach.GetPublisherSpaces(voRequestGetPublisherSpaces);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}