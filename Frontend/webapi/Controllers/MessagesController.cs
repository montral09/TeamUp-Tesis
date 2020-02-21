using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;
using System.Threading.Tasks;

namespace webapi.Controllers
{
    public class MessagesController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/messages")]
        public IHttpActionResult Post([FromBody]VORequestGetMessages voGetMessages)
        {
            try
            {
                VOResponseGetMessages voResp = new VOResponseGetMessages();
                voResp = fach.GetMessages(voGetMessages);               
                return Ok(voResp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }       
    }
}