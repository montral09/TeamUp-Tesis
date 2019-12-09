using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;
using System.Threading.Tasks;
using backend.Data_Access.VO.Responses;

namespace webapi.Controllers
{
    public class PublicationPlanAdminController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publicationPlanAdmin")]
        public IHttpActionResult Post([FromBody]VORequestGetPublicationPlanPayments voGetPayment)
        {
            try
            {
                VOResponseGetPublicationPlanPayments voResp = new VOResponseGetPublicationPlanPayments();
                voResp = fach.GetPublicationPlanPayments(voGetPayment);
                return Ok(voResp);               
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
       
    }
}