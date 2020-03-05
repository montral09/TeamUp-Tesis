﻿using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Collections.Generic;
using backend.Data_Access.VO.Data;
using backend.Exceptions;

namespace webapi.Controllers
{

    public class UserDataController : ApiController
    {
        IFacade fach = Facade.Instance;  

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/userData")]
        public IHttpActionResult Post(VORequestGetUserData voUserData)
        {
            try
            {
                VOResponseGetUserData voResp = new VOResponseGetUserData();
                voResp = fach.GetUserData(voUserData);
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}