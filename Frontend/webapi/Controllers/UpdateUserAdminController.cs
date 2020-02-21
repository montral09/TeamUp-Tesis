using backend.Data_Access.VO;
using backend.Exceptions;
using backend.Logic;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class UpdateUserAdminController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/updateUserAdmin")]
        public IHttpActionResult Put([FromBody]VORequestUpdateUserAdmin voRequestUpdate)
        {
            try
            {
                string result;
                VOResponseUpdateUserAdmin voResp = new VOResponseUpdateUserAdmin();
                result = fach.UpdateUserAdmin(voRequestUpdate);
                if (result.Equals(EnumMessages.OK.ToString()))
                {
                    voResp.responseCode = EnumMessages.SUCC_USRUPDATED.ToString();
                } else
                {
                    voResp.responseCode = result;
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