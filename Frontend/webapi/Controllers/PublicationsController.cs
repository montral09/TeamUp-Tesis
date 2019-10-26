﻿using backend.Logic;
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
    public class PublicationsController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;      
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/publications")]
        public async Task<IHttpActionResult> Post([FromBody]VORequestGetPublicationsWithFilters voGetPublicationsFilter)
        {
            try
            {
                VOResponseGetPublicationsWithFilters voResp = new VOResponseGetPublicationsWithFilters();

                voResp = fach.GetPublicationsWithFilters(voGetPublicationsFilter);               
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}