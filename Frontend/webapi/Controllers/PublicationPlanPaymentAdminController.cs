using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
using backend.Data_Access.VO.Responses;

namespace webapi.Controllers
{
    public class PublicationPlanPaymentAdminController : ApiController
    {
        IFacade fach = Facade.Instance;        
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publicationPlanPaymentAdmin")]
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

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publicationPlanPaymentAdmin")]
        public IHttpActionResult Put([FromBody]VORequestUpdatePreferentialPaymentAdmin voUpdatePayment)
        {
            try
            {
                VOResponseUpdatePreferentialPaymentAdmin voResp = new VOResponseUpdatePreferentialPaymentAdmin();
                voResp = fach.UpdatePreferentialPaymentAdmin(voUpdatePayment);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }            
        }
    }
}