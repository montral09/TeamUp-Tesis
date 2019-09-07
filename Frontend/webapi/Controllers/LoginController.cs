using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
using backend.Data_Access.VO.Data;

namespace webapi.Controllers
{
    public class LoginController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult Post([FromBody]VORequestLogin voLogin)
        {
            try
            {
                bool userMailExists = fach.userExists(voLogin.Mail);
                VOResponseLogin voResp = new VOResponseLogin();
                if (userMailExists == true)
                {
                    VOUser userLogged = fach.ValidUserLogin(voLogin.Mail, voLogin.Password);
                    if (userLogged != null)
                    {
                        voResp.responseCode = EnumMessages.SUCC_USRLOGSUCCESS.ToString();
                        voResp.voUserLog = userLogged;
                    }
                    else
                    {
                        voResp.responseCode = EnumMessages.ERR_USRWRONGPASS.ToString();
                    }
                }
                else
                {
                    voResp.responseCode = EnumMessages.ERR_USRMAILNOTEXIST.ToString();
                }
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(e);
            }
        }
    }
}