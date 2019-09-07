using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class AdminController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/admin")]
        public IHttpActionResult Post([FromBody]VORequestAdminLogin voAdmin)
        {
            try
            {
                bool adminMailExists = fach.AdminExists(voAdmin.Mail);
                VOResponseAdminLogin voResp = new VOResponseAdminLogin();
                if (adminMailExists == true)
                {
                    VOAdmin admin = fach.GetAdmin(voAdmin.Mail, voAdmin.Password);
                    if (admin != null)
                    {
                        voResp.responseCode = EnumMessages.SUCC_USRLOGSUCCESS.ToString();
                        voResp.voAdmin = admin;
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
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}