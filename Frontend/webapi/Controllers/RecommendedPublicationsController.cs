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
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
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

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/publication")]
        public IHttpActionResult Get(int idPublication, string mail)
        {
            try
            {
                VOResponseGetSpace voResp = new VOResponseGetSpace();
                voResp = fach.GetSpace(idPublication, mail);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publication")]
        public IHttpActionResult Put([FromBody]VORequestUpdateStatePublication voUpdateStatePublication)
        {
            try
            {
                VOResponseUpdateStatePublication voResp = new VOResponseUpdateStatePublication();
                voResp = fach.UpdateStatePublication(voUpdateStatePublication);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}