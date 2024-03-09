using ClinicaEntidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicaData.Contrato
{
    public interface IUsuarioRepositorio
    {
        Task<List<Usuario>> Lista(int IdRolUsuario =0);
        Task<Usuario> Login(string DocumentoIdentidad, string Clave);
        Task<string> Guardar(Usuario objeto);
        Task<string> Editar(Usuario objeto);
        Task<int> Eliminar(int Id);
    }
}
