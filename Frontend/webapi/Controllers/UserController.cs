﻿using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;
using backend.Exceptions;

namespace webapi.Controllers
{
    public class UserController : ApiController
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/user")]
        public IHttpActionResult Post([FromBody]VORequestUserCreate voUser)
        {
            try
            {
                bool userMailExists = fach.userExists(voUser.Mail);
                VOResponseUserCreate voResp = new VOResponseUserCreate();
                if (userMailExists == true)
                {
                    voResp.responseCode = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                }
                else {
                    fach.CreateUser(voUser);
                    voResp.responseCode = EnumMessages.SUCC_USRCREATED.ToString();
                }
                return Ok(voResp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpPut]
        [Route("api/user")]
        public IHttpActionResult Put([FromBody]VORequestUserUpdate voUser)
        {
            try
            {
                VOResponseUserUpdate voResp = new VOResponseUserUpdate();
                if (!voUser.Mail.Equals(voUser.NewMail))
                {
                    // Check if new mail already exists
                    Boolean mailAlreadyExists = fach.userExists(voUser.NewMail);
                    if (mailAlreadyExists)
                    {
                        voResp.responseCode = EnumMessages.ERR_MAILALREADYEXIST.ToString();
                        return Ok(voResp);
                    } 
                } 
                fach.UpdateUser(voUser);
                voResp.responseCode = EnumMessages.SUCC_USRUPDATED.ToString();                
                return Ok(voResp);

            }             
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpDelete]
        [Route("api/user")]
        public IHttpActionResult Delete([FromBody]VORequestUserDelete voUser)
        {
            try
            {
                VOResponseUserDelete voResp = new VOResponseUserDelete();
                fach.DeleteUser(voUser.Mail);
                voResp.responseCode = EnumMessages.SUCC_USRDELETED.ToString();
                return Ok(voResp);
            }
            catch (GeneralException e)
            {
                return InternalServerError(new Exception(e.Codigo));
            }
        }
    }
}