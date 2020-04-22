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
        readonly IFacade fach = Facade.Instance;  

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/passwordRecovery")]
        public IHttpActionResult Post([FromBody]VORequestPasswordRecovery voPasswordRecovery)
        {
            try
            {
                VOResponsePasswordRecovery voResp = new VOResponsePasswordRecovery();
                voResp = fach.RecoverPassword(voPasswordRecovery);    
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}