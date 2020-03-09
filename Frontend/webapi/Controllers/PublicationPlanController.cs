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
    public class PublicationPlanController : ApiController
    {
        IFacade fach = Facade.Instance;        
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/publicationPlan")]
        public IHttpActionResult Get()
        {
            try
            {
                VOResponseGetPublicationPlans voResp = new VOResponseGetPublicationPlans();
                voResp = fach.GetPublicationPlans();
                voResp.responseCode = EnumMessages.SUCC_PUBLICATIONPLANSOK.ToString();
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publicationPlan")]
        public async Task<IHttpActionResult> Put([FromBody]VORequestUpdatePreferentialPayment voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePreferentialPayment voResp = new VOResponseUpdatePreferentialPayment();
                voResp = await fach.UpdatePreferentialPayment(voUpdatePayment);
                return Ok(voResp);               
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}