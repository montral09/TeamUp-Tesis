using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class FavoriteController : ApiController
    {
        IFacade fach = Facade.Instance;  

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

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/favorite")]
        public IHttpActionResult Put([FromBody] VORequestGetFavorite voGetFavorite)
        {
            try
            {
                VOResponseGetFavorites voResp = new VOResponseGetFavorites();
                voResp = fach.GetFavorites(voGetFavorite);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {

                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}