using ClinicaData.Configuracion;
using ClinicaData.Contrato;
using ClinicaEntidades;
using Microsoft.Extensions.Options;
using System.Data.SqlClient;
using System.Data;

namespace ClinicaData.Implementacion
{
    public class CitaRepositorio : ICitaRepositorio
    {
        private readonly ConnectionStrings con;
        public CitaRepositorio(IOptions<ConnectionStrings> options)
        {
            con = options.Value;
        }

        public async Task<string> CambiarEstado(int IdCita, int IdEstado, string Indicaciones)
        {
            string respuesta = "";
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {

                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_CambiarEstadoCita", conexion);
                cmd.Parameters.AddWithValue("@IdCita", IdCita);
                cmd.Parameters.AddWithValue("@IdEstadoCita", IdEstado);
                cmd.Parameters.AddWithValue("@Indicaciones", Indicaciones);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al cambiar estado";
                }
            }
            return respuesta;
        }

        public async Task<string> Cancelar(int Id)
        {
            string respuesta = "";
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_CancelarCita", conexion);
                cmd.Parameters.AddWithValue("@IdCita", Id);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al cancelar la cita";
                }
            }
            return respuesta;
        }

        public async Task<string> Guardar(Cita objeto)
        {
            string respuesta = "";
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_guardarCita", conexion);
                cmd.Parameters.AddWithValue("@IdUsuario", objeto.Usuario.IdUsuario);
                cmd.Parameters.AddWithValue("@IdDoctorHorarioDetalle", objeto.DoctorHorarioDetalle.IdDoctorHorarioDetalle);
                cmd.Parameters.AddWithValue("@IdEstadoCita", objeto.EstadoCita.IdEstadoCita);
                cmd.Parameters.AddWithValue("@FechaCita", objeto.FechaCita);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al guardar la cita";
                }
            }
            return respuesta;
        }

        public async Task<List<Cita>> ListaCitasPendiente(int IdUsuario)
        {
            List<Cita> lista = new List<Cita>();

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListaCitasPendiente", conexion);
                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new Cita()
                        {
                            IdCita = Convert.ToInt32(dr["IdCita"]),
                            FechaCita = dr["FechaCita"].ToString()!,
                            HoraCita = dr["HoraCita"].ToString()!,
                            Especialidad = new Especialidad()
                            {
                                Nombre = dr["NombreEspecialidad"].ToString()!,
                            },
                            Doctor = new Doctor()
                            {
                                Nombres = dr["Nombres"].ToString()!,
                                Apellidos = dr["Apellidos"].ToString()!,
                            }
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<List<Cita>> ListaHistorialCitas(int IdUsuario)
        {

            List<Cita> lista = new List<Cita>();

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListaHistorialCitas", conexion);
                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new Cita()
                        {
                            IdCita = Convert.ToInt32(dr["IdCita"]),
                            FechaCita = dr["FechaCita"].ToString()!,
                            HoraCita = dr["HoraCita"].ToString()!,
                            Indicaciones = dr["Indicaciones"].ToString()!,
                            Especialidad = new Especialidad()
                            {
                                Nombre = dr["NombreEspecialidad"].ToString()!,
                            },
                            Doctor = new Doctor()
                            {
                                Nombres = dr["Nombres"].ToString()!,
                                Apellidos = dr["Apellidos"].ToString()!,
                            }
                        });
                    }
                }
            }
            return lista;
        }
    }
}
