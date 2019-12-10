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
    public class PublicationPlanPaymentController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;   

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publicationPlanPayment")]
        public async Task<IHttpActionResult> Put([FromBody]VORequestUpdatePreferentialPayment voUpdateEvidence)
        {
            try
            {
                VOResponseUpdatePreferentialPayment voResp = new VOResponseUpdatePreferentialPayment();
                voResp = await fach.UpdatePreferentialPayment(voUpdateEvidence);
                return Ok(voResp);               
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}