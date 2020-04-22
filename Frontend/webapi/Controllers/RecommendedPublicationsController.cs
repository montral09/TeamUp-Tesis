using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;
using System.Threading.Tasks;

namespace webapi.Controllers
{
    public class RecommendedPublicationsController : ApiController
    {
        IFacade fach = Facade.Instance;        
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/recommendedPublications")]
        public IHttpActionResult Get()
        {
            try
            {
                VOResponseGetRecommendedPublications voResp = new VOResponseGetRecommendedPublications();
                voResp = fach.GetRecommendedPublications();               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}