using backend.Data_Access.VO;
using backend.Exceptions;
using backend.Logic;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class TokensController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/tokens")]
        public IHttpActionResult Post([FromBody]VORequestTokensUpdate voRequestToken)
        {
            try
            {
                VOResponseTokensUpdate voResp = new VOResponseTokensUpdate();
                voResp = fach.UpdateTokens(voRequestToken);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}