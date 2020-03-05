using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using System.IO;
using System.Threading.Tasks;

namespace webapi.Controllers
{
    public class PublicationQuestionsController : ApiController
    {
        IFacade fach = Facade.Instance;        
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publicationQuestions")]
        public IHttpActionResult Post([FromBody]VORequestCreatePublicationQuestion voCreatePublicationQuestion)
        {
            try
            {
                VOResponseCreatePublicationQuestion voResp = new VOResponseCreatePublicationQuestion();

                voResp = fach.CreatePublicationQuestion(voCreatePublicationQuestion);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/publicationQuestions")]
        public IHttpActionResult Put([FromBody]VORequestCreatePublicationAnswer voCreatePublicationAnswer)
        {
            try
            {
                VOResponseCreatePublicationAnswer voResp = new VOResponseCreatePublicationAnswer();
                voResp = fach.CreatePublicationAnswer(voCreatePublicationAnswer);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }        
    }
}