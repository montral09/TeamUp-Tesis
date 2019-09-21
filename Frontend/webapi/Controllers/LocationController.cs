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
    public class LocationController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/locations")]
        public IHttpActionResult Get()
        {
            try
            {
                VOResponseGetLocations voResp = new VOResponseGetLocations();
                List<VOLocation> locations = fach.GetLocations();
                voResp.responseCode = EnumMessages.SUCC_LOCATIONSOK.ToString();
                voResp.voLocations = locations;


                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}