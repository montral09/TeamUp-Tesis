using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Collections.Generic;
using backend.Data_Access.VO.Data;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class PublisherController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publisher")]
        public IHttpActionResult Get(VORequestGetPublishers voPublishers)
        {
            try
            {               
                VOResponseGetPublishers voResp = new VOResponseGetPublishers();
                voResp = fach.GetPublishers(voPublishers);
                return Ok(voResp);
            }
            catch (GeneralException e) { 
            
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publisher")]
        public IHttpActionResult Put([FromBody] VORequestApprovePublishers voPublishers)
        {
            try
            {
                VOResponseApprovePublishers voResp = new VOResponseApprovePublishers();
                voResp = fach.ApprovePublishers(voPublishers);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

    }
}