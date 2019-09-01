using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Collections.Generic;

namespace webapi.Controllers
{
    public class PublisherController : ApiController
    {
        IFachadaWeb fach = new FabricaFachadas().CrearFachadaWEB;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/publisher")]
        public IHttpActionResult Get()
        {
            try
            {               
                VOResponseGetUsers voResp = new VOResponseGetUsers();
                List<VOUser> publishers = fach.GetPublishers();
                voResp.responseCode = EnumMessages.SUCC_PUBLISHERSOK.ToString();
                voResp.voUsers = publishers;


                return Ok(voResp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publisher")]
        public IHttpActionResult Put([FromBody] List<VOUser> publishers)
        {
            try
            {
                VOResponse voResp = new VOResponse();
                fach.ApprovePublishers(publishers);
                voResp.responseCode = EnumMessages.SUCC_PUBLISHERSOK.ToString();

                return Ok(voResp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }

    }
}