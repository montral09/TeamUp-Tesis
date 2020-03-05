using backend.Logic;
using backend.Data_Access.VO;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
namespace webapi.Controllers
{
    
    public class LoginController : ApiController
    {
        IFacade fach = Facade.Instance;  

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult Post([FromBody]VORequestLogin voLogin)
        {
            try
            {
                bool userMailExists = fach.UserExists(voLogin.Mail);
                VOResponseLogin voResp = new VOResponseLogin();
                if (userMailExists == true)
                {
                    bool mailValidated = fach.IsMailValidated(voLogin.Mail);
                    if (mailValidated)
                    {
                        voResp = fach.ValidUserLogin(voLogin.Mail, voLogin.Password);
                        if (voResp != null)
                        {                           
                            voResp.responseCode = EnumMessages.SUCC_USRLOGSUCCESS.ToString();
                        }
                        else
                        {
                            voResp = new VOResponseLogin();
                            voResp.responseCode = EnumMessages.ERR_USRWRONGPASS.ToString();
                        }                                                
                    } else
                    {
                        voResp.responseCode = EnumMessages.ERR_MAILNOTVALIDATED.ToString();
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