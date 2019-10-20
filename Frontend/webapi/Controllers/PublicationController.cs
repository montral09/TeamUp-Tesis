using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;

namespace webapi.Controllers
{
    public class PublicationController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publication")]
        public IHttpActionResult Post([FromBody]VORequestCreatePublication voCreatePublication)
        {
            try
            {
                VOResponseCreatePublication voResp = new VOResponseCreatePublication();

                voResp = fach.CreatePublication(voCreatePublication);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        [Route("api/publication")]
        public IHttpActionResult Get(int idPublication)
        {
            try
            {
                VOResponseGetSpace voResp = new VOResponseGetSpace();
                voResp = fach.GetSpace(idPublication);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publication")]
        public IHttpActionResult Put([FromBody]VORequestUpdateStatePublication voUpdateStatePublication)
        {
            try
            {
                VOResponseUpdateStatePublication voResp = new VOResponseUpdateStatePublication();
                voResp = fach.UpdateStatePublication(voUpdateStatePublication);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}