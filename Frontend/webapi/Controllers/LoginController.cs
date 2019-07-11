using backend.Logica;
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
        public IHttpActionResult Post([FromBody]Usuario correo)
        {
            //VORetorno retorno = new VORetorno();
            //retorno.Error = "ok";
            //retorno.Mensaje = "";
            try
            {
                bool condicion = fach.existeUsuario(correo.Nombre);
                Usuario usuarioRespuesta = new Usuario("","","","");
                if (condicion == true)
                {
                    usuarioRespuesta.Nombre = "VERDADERO";
                }
                else
                {
                    usuarioRespuesta.Nombre = "FALSO";
                }
                //retorno.Mensaje = "Ingreso al sistema con exito";
                return Ok(usuarioRespuesta);
            }
            catch (Exception e)
            {
                return InternalServerError(new Exception(e.Message));
            }
        }
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
        }
    }
}