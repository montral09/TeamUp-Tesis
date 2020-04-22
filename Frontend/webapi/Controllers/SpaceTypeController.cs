using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.Collections.Generic;
using backend.Data_Access.VO.Responses;

namespace webapi.Controllers
{
    public class SpaceTypeController : ApiController
    {
        IFacade fach = Facade.Instance;  

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/spaceTypes")]
        public IHttpActionResult Get()
        {
            try
            {
                VOResponseGetSpaceTypes voResp = new VOResponseGetSpaceTypes();
                List<VOSpaceType> spaceTypes = fach.GetSpaceTypes();
                voResp.responseCode = EnumMessages.SUCC_SPACETYPESOK.ToString();
                voResp.spaceTypes = spaceTypes;
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}