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
    public class FacilitiesController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/facilities")]
        public IHttpActionResult Post(VORequestGetFacilities voRequestFacilities)
        {
            try
            {
                VOResponseGetFacilities voResp = new VOResponseGetFacilities();
                voResp = fach.GetFacilities(voRequestFacilities);
                if (voResp.responseCode.Equals(EnumMessages.OK.ToString()))
                {
                    voResp.responseCode = EnumMessages.SUCC_FACILITIESOK.ToString();
                }
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}