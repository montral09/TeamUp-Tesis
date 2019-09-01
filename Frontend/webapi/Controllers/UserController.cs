using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {
        IFachadaWeb fach = new FabricaFachadas().CrearFachadaWEB;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/user")]
        public IHttpActionResult Post([FromBody]VOUser voUser)
        {
            try
            {
                bool userMailExists = fach.userExists(voUser.Mail);
                VOResponseUserCreate voResp = new VOResponseUserCreate();
                if (userMailExists == true)
                {
                    voResp.responseCode = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                }
                else {
                    fach.CreateUser(voUser);
                    voResp.responseCode = EnumMessages.SUCC_USRCREATED.ToString();
                }
                return Ok(voResp);
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