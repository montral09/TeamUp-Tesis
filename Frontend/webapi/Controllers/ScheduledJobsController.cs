using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class ScheduledJobsController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/scheduledJobs")]
        public IHttpActionResult Post()
        {
            try
            {
                /* fach.FinishPublications();
                 fach.FinishReservations();
                 fach.StartReservation();*/
                //fach.Test();
                return null;                
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}