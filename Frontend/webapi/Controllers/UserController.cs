using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/user")]
        public IHttpActionResult Post([FromBody]VORequestUserCreate voUser)
        {
            try
            {
                VOResponseUserCreate voResp = new VOResponseUserCreate();
                voResp = fach.CreateUser(voUser); 
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
        public IHttpActionResult Put([FromBody]VORequestUserUpdate voUser)
        {
            try
            {
                VOResponseUserUpdate voResp = new VOResponseUserUpdate();
                voResp = fach.UpdateUser(voUser);                              
                return Ok(voResp);
            }             
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpDelete]
        [Route("api/user")]
        public IHttpActionResult Delete([FromBody]VORequestUserDelete voUser)
        {
            try
            {
                VOResponseUserDelete voResp = new VOResponseUserDelete();
                voResp = fach.DeleteUser(voUser);                
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/users")]
        public IHttpActionResult Post([FromBody]VORequestGetUsers voRequest)
        {
            try
            {
                VOResponseGetUsers voResp = new VOResponseGetUsers();
                voResp = fach.GetUsers(voRequest);
                if (voResp.responseCode.Equals(EnumMessages.OK.ToString()))
                {
                    voResp.responseCode = EnumMessages.SUCC_USERSOK.ToString();
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