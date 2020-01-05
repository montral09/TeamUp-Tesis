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
    public class ReviewController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/review")]
        public IHttpActionResult Post([FromBody] VORequestCreateReview voCreateReview)
        {
            try
            {
                VOResponseCreateReview voResp = new VOResponseCreateReview();
                voResp = fach.CreateReview(voCreateReview);
                return Ok(voResp);
            }
            catch (GeneralException e) { 
            
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}