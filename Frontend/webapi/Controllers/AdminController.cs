using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class AdminController : ApiController
    {
        IFacade fach = Facade.Instance;  

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/admin")]
        public IHttpActionResult Post([FromBody]VORequestAdminLogin voAdmin)
        {
            try
            {
                VOResponseAdminLogin voResp = new VOResponseAdminLogin();
                voResp = fach.GetAdmin(voAdmin.Mail, voAdmin.Password); 
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}