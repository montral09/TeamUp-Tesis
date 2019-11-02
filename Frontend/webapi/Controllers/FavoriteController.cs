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
    public class FavoriteController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/favorite")]
        public IHttpActionResult Post([FromBody] VORequestUpdateFavorite voUpdateFavorite)
        {
            try
            {
                VOResponseUpdateFavorite voResp = new VOResponseUpdateFavorite();
                voResp = fach.UpdateFavorite(voUpdateFavorite);
                return Ok(voResp);
            }
            catch (GeneralException e) { 
            
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}