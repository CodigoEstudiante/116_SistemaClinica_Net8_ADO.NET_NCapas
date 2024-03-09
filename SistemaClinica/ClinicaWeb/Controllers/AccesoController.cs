using ClinicaEntidades;
using ClinicaWeb.Models.DTOs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ClinicaData.Contrato;

namespace ClinicaWeb.Controllers
{
    public class AccesoController : Controller
    {
        private readonly IUsuarioRepositorio _repositorio;
        public AccesoController(IUsuarioRepositorio repositorio)
        {
            _repositorio = repositorio;
        }
        public IActionResult Login()
        {
            ClaimsPrincipal claimuser = HttpContext.User;
            if (claimuser.Identity!.IsAuthenticated)
            {
                string rol = claimuser.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).SingleOrDefault()!;
                if (rol == "Administrador") return RedirectToAction("Index", "Home");
                if (rol == "Paciente") return RedirectToAction("Index", "Citas");
                if (rol == "Doctor") return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(VMUsuarioLogin modelo)
        {
            if (modelo.DocumentoIdentidad == null || modelo.Clave == null)
            {
                ViewData["Mensaje"] = "No se encontraron coincidencias";
                return View();
            }

            Usuario usuario_encontrado = await _repositorio.Login(modelo.DocumentoIdentidad, modelo.Clave);

            if (usuario_encontrado == null)
            {
                ViewData["Mensaje"] = "No se encontraron coincidencias";
                return View();
            }

            ViewData["Mensaje"] = null;

            //aqui guarderemos la informacion de nuestro usuario
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, $"{usuario_encontrado.Nombre} {usuario_encontrado.Apellido}"),
                new Claim(ClaimTypes.NameIdentifier, usuario_encontrado.IdUsuario.ToString()),
                new Claim(ClaimTypes.Role,usuario_encontrado.RolUsuario.Nombre)
            };


            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            AuthenticationProperties properties = new AuthenticationProperties()
            {
                AllowRefresh = true
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);

            string rol = usuario_encontrado.RolUsuario.Nombre;
            if (rol == "Paciente") return RedirectToAction("Index", "Citas");
            if (rol == "Doctor") return RedirectToAction("CitasAsignadas", "Citas");

            return RedirectToAction("Index", "Home");
        }
        public IActionResult Registrarse()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Registrarse(VMPaciente modelo)
        {
            if (modelo.Clave != modelo.ConfirmarClave)
            {
                ViewBag.Mensaje = "Las contraseñas no coinciden";
                return View();
            }

            Usuario objeto = new Usuario()
            {
                NumeroDocumentoIdentidad = modelo.DocumentoIdentidad,
                Nombre = modelo.Nombre,
                Apellido = modelo.Apellido,
                Correo = modelo.Correo,
                Clave = modelo.Clave,
                RolUsuario = new RolUsuario()
                {
                    IdRolUsuario = 2
                }
            };
            string resultado = await _repositorio.Guardar(objeto);
            ViewBag.Mensaje = resultado;
            if (resultado == "")
            {
                ViewBag.Creado = true;
                ViewBag.Mensaje = "Su cuenta ha sido creada.";
            }
            return View();
        }

        public IActionResult Denegado()
        {
            return View();
        }
    }
}
