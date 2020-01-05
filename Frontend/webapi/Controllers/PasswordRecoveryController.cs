using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class PasswordRecoveryController : ApiController
    {
        readonly IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/passwordRecovery")]
        public IHttpActionResult Post([FromBody]VORequestPasswordRecovery voPasswordRecovery)
        {
            try
            {
                VOResponsePasswordRecovery voResp = new VOResponsePasswordRecovery();
                bool userExists = fach.UserExists(voPasswordRecovery.Mail);
                if (userExists)
                {
                    fach.RecoverPassword(voPasswordRecovery);
                    voResp.responseCode = EnumMessages.SUCC_PASSWORDUPDATED.ToString();
                } else
                {
                    voResp.responseCode = EnumMessages.ERR_USRMAILNOTEXIST.ToString();
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