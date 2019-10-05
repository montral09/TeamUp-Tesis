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
        [HttpGet]
        [Route("api/publisher")]
        public IHttpActionResult Get()
        {
            try
            {               
                VOResponseGetPublishers voResp = new VOResponseGetPublishers();
                List<VOPublisher> publishers = fach.GetPublishers();
                voResp.responseCode = EnumMessages.SUCC_PUBLISHERSOK.ToString();
                voResp.voUsers = publishers;


                return Ok(voResp);
            }
            catch (GeneralException e)
            {
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