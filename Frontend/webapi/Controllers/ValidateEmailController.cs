using backend.Data_Access.VO;
using backend.Exceptions;
using backend.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class ValidateEmailController : ApiController
    {
        readonly IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/validateEmail")]
        public IHttpActionResult Post([FromBody]VORequestValidateEmail voValidateEmail)
        {
            try
            {
                VOResponseValidateEmail voResp = new VOResponseValidateEmail();
                int numberOfRecords = fach.ValidateEmail(voValidateEmail);
                if (numberOfRecords == 0)
                {
                    voResp.responseCode = EnumMessages.ERR_ACTIVATIONCODENOTEXIST.ToString();
                } else
                {
                    voResp.responseCode = EnumMessages.SUCC_EMAILVALIDATED.ToString();
                }
                
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}