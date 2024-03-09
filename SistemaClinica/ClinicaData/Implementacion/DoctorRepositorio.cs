using ClinicaData.Contrato;
using ClinicaEntidades;
using System.Data.SqlClient;
using System.Data;
using ClinicaData.Configuracion;
using Microsoft.Extensions.Options;
using ClinicaEntidades.DTO;
using System.Xml.Linq;

namespace ClinicaData.Implementacion
{
    public class DoctorRepositorio : IDoctorRepositorio
    {
        private readonly ConnectionStrings con;
        public DoctorRepositorio(IOptions<ConnectionStrings> options)
        {
            con = options.Value;
        }
        public async Task<string> Editar(Doctor objeto)
        {
            string respuesta = "";
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_editarDoctor", conexion);
                cmd.Parameters.AddWithValue("@IdDoctor", objeto.IdDoctor);
                cmd.Parameters.AddWithValue("@NumeroDocumentoIdentidad", objeto.NumeroDocumentoIdentidad);
                cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);
                cmd.Parameters.AddWithValue("@Genero", objeto.Genero);
                cmd.Parameters.AddWithValue("@IdEspecialidad", objeto.Especialidad.IdEspecialidad);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al editar el doctor";
                }
            }
            return respuesta;
        }

        public async Task<int> Eliminar(int Id)
        {
            int respuesta = 1;
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_eliminarDoctor", conexion);
                cmd.Parameters.AddWithValue("@IdDoctor", Id);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                }
                catch
                {
                    respuesta = 0;
                }

            }
            return respuesta;
        }

        public async Task<string> EliminarHorario(int Id)
        {
            string respuesta = "";

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_eliminarDoctorHorario", conexion);
                cmd.Parameters.AddWithValue("@IdDoctorHorario", Id);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al eliminar el horario";
                }
            }
            return respuesta;
        }

        public async Task<string> Guardar(Doctor objeto)
        {

            string respuesta = "";
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_guardarDoctor", conexion);
                cmd.Parameters.AddWithValue("@NumeroDocumentoIdentidad", objeto.NumeroDocumentoIdentidad);
                cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);
                cmd.Parameters.AddWithValue("@Genero", objeto.Genero);
                cmd.Parameters.AddWithValue("@IdEspecialidad", objeto.Especialidad.IdEspecialidad);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al editar el doctor";
                }
            }
            return respuesta;
        }

        public async Task<List<Doctor>> Lista()
        {
            List<Doctor> lista = new List<Doctor>();

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_listaDoctor", conexion);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new Doctor()
                        {
                            IdDoctor = Convert.ToInt32(dr["IdDoctor"]),
                            NumeroDocumentoIdentidad = dr["NumeroDocumentoIdentidad"].ToString()!,
                            Nombres = dr["Nombres"].ToString()!,
                            Apellidos = dr["Apellidos"].ToString()!,
                            Genero = dr["Genero"].ToString()!,
                            Especialidad = new Especialidad()
                            {
                                IdEspecialidad = Convert.ToInt32(dr["IdEspecialidad"]),
                                Nombre = dr["NombreEspecialidad"].ToString()!,
                            },
                            FechaCreacion = dr["FechaCreacion"].ToString()!
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<List<Cita>> ListaCitasAsignadas(int Id,int IdEstadoCita)
        {
            List<Cita> lista = new List<Cita>();

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListaCitasAsignadas", conexion);
                cmd.Parameters.AddWithValue("@IdDoctor", Id);
                cmd.Parameters.AddWithValue("@IdEstadoCita", IdEstadoCita);
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
                            Usuario = new Usuario()
                            {
                                Nombre = dr["Nombre"].ToString()!,
                                Apellido = dr["Apellido"].ToString()!,
                            },
                            EstadoCita = new EstadoCita()
                            {
                                Nombre = dr["EstadoCita"].ToString()!
                            },
                            Indicaciones = dr["Indicaciones"].ToString()!
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<List<DoctorHorario>> ListaDoctorHorario()
        {
            List<DoctorHorario> lista = new List<DoctorHorario>();

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_listaDoctorHorario", conexion);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new DoctorHorario()
                        {
                            IdDoctorHorario = Convert.ToInt32(dr["IdDoctorHorario"]),
                            Doctor = new Doctor()
                            {
                                NumeroDocumentoIdentidad = dr["NumeroDocumentoIdentidad"].ToString()!,
                                Nombres = dr["Nombres"].ToString()!,
                                Apellidos = dr["Apellidos"].ToString()!,
                            },
                            NumeroMes = Convert.ToInt32(dr["NumeroMes"]),
                            HoraInicioAM = dr["HoraInicioAM"].ToString()!,
                            HoraFinAM = dr["HoraFinAM"].ToString()!,
                            HoraInicioPM = dr["HoraInicioPM"].ToString()!,
                            HoraFinPM = dr["HoraFinPM"].ToString()!,
                            FechaCreacion = dr["FechaCreacion"].ToString()!
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<List<FechaAtencionDTO>> ListaDoctorHorarioDetalle(int Id)
        {
            List<FechaAtencionDTO> lista = new List<FechaAtencionDTO>();

            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_listaDoctorHorarioDetalle", conexion);
                cmd.Parameters.AddWithValue("@IdDoctor", Id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var dr = await cmd.ExecuteXmlReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        XDocument doc = XDocument.Load(dr);
                        lista = ((doc.Elements("HorarioDoctor")) != null) ? (from FechaAtencion in doc.Element("HorarioDoctor")!.Elements("FechaAtencion")
                                                                             select new FechaAtencionDTO()
                                                                             {
                                                                                 Fecha = FechaAtencion.Element("Fecha")!.Value,
                                                                                 HorarioDTO = FechaAtencion.Elements("Horarios") != null ? (from Hora in FechaAtencion.Element("Horarios")!.Elements("Hora")
                                                                                                                                            select new HorarioDTO()
                                                                                                                                            {
                                                                                                                                                IdDoctorHorarioDetalle = Convert.ToInt32(Hora.Element("IdDoctorHorarioDetalle")!.Value),
                                                                                                                                                Turno = Hora.Element("Turno")!.Value,
                                                                                                                                                TurnoHora = Hora.Element("TurnoHora")!.Value
                                                                                                                                            }).ToList() : new List<HorarioDTO>()

                                                                             }).ToList() : new List<FechaAtencionDTO>();

                    }
                }
            }
            return lista;
        }

        public async Task<string> RegistrarHorario(DoctorHorario objeto)
        {
            string respuesta = "";
            using (var conexion = new SqlConnection(con.CadenaSQL))
            {
                await conexion.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_registrarDoctorHorario", conexion);
                cmd.Parameters.AddWithValue("@IdDoctor", objeto.Doctor.IdDoctor);
                cmd.Parameters.AddWithValue("@NumeroMes", objeto.NumeroMes);
                cmd.Parameters.AddWithValue("@HoraInicioAM", objeto.HoraInicioAM);
                cmd.Parameters.AddWithValue("@HoraFinAM", objeto.HoraFinAM);
                cmd.Parameters.AddWithValue("@HoraInicioPM", objeto.HoraInicioPM);
                cmd.Parameters.AddWithValue("@HoraFinPM", objeto.HoraFinPM);
                cmd.Parameters.AddWithValue("@Fechas", objeto.DoctorHorarioDetalle.Fecha);
                cmd.Parameters.Add("@msgError", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await cmd.ExecuteNonQueryAsync();
                    respuesta = Convert.ToString(cmd.Parameters["@msgError"].Value)!;
                }
                catch
                {
                    respuesta = "Error al registrar el horario";
                }
            }
            return respuesta;
        }
    }
}
