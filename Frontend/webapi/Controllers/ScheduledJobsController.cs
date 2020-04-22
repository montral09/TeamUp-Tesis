using backend.Logic;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
using backend.Data_Access.VO;

namespace webapi.Controllers
{
    public class ScheduledJobsController : ApiController
    {
        IFacade fach = Facade.Instance;  

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/scheduledJobs")]
        public IHttpActionResult Post()
        {
            VOResponse voResp = new VOResponse();
            try
            {
                voResp = fach.RunScheduledJobs();
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            } catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}