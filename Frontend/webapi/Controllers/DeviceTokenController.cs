using backend.Logic;
using backend.Data_Access.VO;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;
namespace webapi.Controllers
{
    
    public class DeviceTokenController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/deviceToken")]
        public IHttpActionResult Post([FromBody]VORequestCreateDeviceToken voCreateDeviceToken)
        {
            try
            {
                VOResponseCreateDeviceToken voResp = new VOResponseCreateDeviceToken();
                voResp = fach.CreateDeviceToken(voCreateDeviceToken);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(e);
            }
        }
    }
}