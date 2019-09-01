using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class LoginController : ApiController
    {
        IFachadaWeb fach = new FabricaFachadas().CrearFachadaWEB;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult Post([FromBody]VOUserLogin voUserLog)
        {
            try
            {

                bool userMailExists = fach.userExists(voUserLog.Mail);
                VOResponseLogin voresp = new VOResponseLogin();
                if (userMailExists == true)
                {
                    VOUserLogin userLogged = fach.ValidUserLogin(voUserLog.Mail, voUserLog.Password);
                    if (userLogged != null)
                    {
                        voresp.responseCode = EnumMessages.SUCC_USRLOGSUCCESS.ToString();
                        voresp.vouserLog = userLogged;
                    }
                    else
                    {
                        voresp.responseCode = EnumMessages.ERR_USRWRONGPASS.ToString();
                    }
                }
                else
                {
                    voresp.responseCode = EnumMessages.ERR_USRMAILNOTEXIST.ToString();
                }
                return Ok(voresp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }
    }
}