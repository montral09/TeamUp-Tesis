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
    public class ReservationTypesController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/reservationTypes")]
        public IHttpActionResult Post(VORequestGetReservationTypes voRequestReservationTypes)
        {
            try
            {
                VOResponseGetReservationTypes voResp = new VOResponseGetReservationTypes();
                voResp = fach.GetReservationTypes(voRequestReservationTypes);
                if (voResp.responseCode.Equals(EnumMessages.OK.ToString()))
                {
                    voResp.responseCode = EnumMessages.SUCC_RESERVATIONTYPESOK.ToString();
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