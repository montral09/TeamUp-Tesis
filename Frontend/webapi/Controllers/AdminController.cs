using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class AdminController : ApiController
    {
        IFachadaWeb fach = new FabricaFachadas().CrearFachadaWEB;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/admin")]
        public IHttpActionResult Post([FromBody]VOUser voUser)
        {
            try
            {
                bool adminMailExists = fach.AdminExists(voUser.Mail);
                VOResponseAdmin voresp = new VOResponseAdmin();
                if (adminMailExists == true)
                {
                    VOUser admin = fach.GetAdmin(voUser.Mail, voUser.Password);
                    if (admin != null)
                    {
                        voresp.responseCode = EnumMessages.SUCC_USRLOGSUCCESS.ToString();
                        voresp.voUser = admin;
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

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/user")]
        public IHttpActionResult Put([FromBody]VOUser voUser)
        {
            try
            {
                VOResponse voResp = new VOResponse();
                fach.UpdateUser(voUser);
                voResp.responseCode = EnumMessages.SUCC_USRUPDATED.ToString();
                return Ok(voResp);
            }             
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpDelete]
        [Route("api/user")]
        public IHttpActionResult Delete([FromBody]VOUser voUser)
        {
            try
            {
                VOResponse voResp = new VOResponse();
                fach.DeleteUser(voUser.Mail);
                voResp.responseCode = EnumMessages.SUCC_USRDELETED.ToString();
                return Ok(voResp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }
    }
}