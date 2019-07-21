using backend.Logic;
using backend.Data_Access.VO;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace webapi.Controllers
{
    public class LoginController : ApiController
    {
        IFachadaWeb fach = new FabricaFachadas().CrearFachadaWEB;

        [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
        [HttpPost]
        [Route("api/login2")]
        public IHttpActionResult Post([FromBody]VOUserLogin voUserLog)
        {
            try
            {
                
                bool userMailExists = fach.userExists(voUserLog.Mail);
                VOResponseLogin voresp = new VOResponseLogin();
                if (userMailExists == true)
                {
                    VOUserLogin userLogged = fach.ValidUserLogin(voUserLog.Mail, voUserLog.Password);
                    if(userLogged != null)
                    {
                        voresp.responseCode = "SUCC-USRLOGSUCCESS ";
                        voresp.vouserLog = userLogged;
                    }
                    else
                    {
                        voresp.responseCode = "ERR-USRWRONGPASS";
                    }
                }
                else
                {
                    voresp.responseCode = "ERR-USRMAILNOTEXIST";
                }
                return Ok(voresp);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }
        /*
        [HttpGet]
        [Route("api/login/{user}")]
        public IHttpActionResult GetCitas(String correo)
        {
            try
            {
                bool condicion = fach.existeUsuario(correo);
                String mensaje = "";

                if (condicion == true)
                {
                    mensaje = "VERDADERO";
                }
                else
                {
                    mensaje = "FALSO";
                }
                //retorno.Mensaje = "Ingreso al sistema con exito";
                return Ok(mensaje);
                //return Ok(fach.ListadoCitasCliente(user));
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }*/
    }
}