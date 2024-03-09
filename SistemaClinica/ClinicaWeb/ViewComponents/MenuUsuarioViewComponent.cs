using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicaWeb.ViewComponents
{
    public class MenuUsuarioViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {

            ClaimsPrincipal claimuser = HttpContext.User;
            string nombreUsuario = "";
            if (claimuser.Identity!.IsAuthenticated)
            {
                nombreUsuario = claimuser.Claims.Where(c => c.Type == ClaimTypes.Name)!.Select(c => c.Value)!.SingleOrDefault()!;
            }

            ViewData["nombreUsuario"] = nombreUsuario;

            return View();
        }

    }
}
