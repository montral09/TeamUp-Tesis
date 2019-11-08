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
    public class PublicationPendingApprovalController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publicationPendingApproval")]
        public IHttpActionResult Post([FromBody]VORequestPublicationPendindApproval voPublicationPendingApproval)
        {
            try
            {
                VOResponsePublicationPendingApproval voResp = new VOResponsePublicationPendingApproval();

                voResp = fach.GetPublicationsPendingApproval(voPublicationPendingApproval);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}