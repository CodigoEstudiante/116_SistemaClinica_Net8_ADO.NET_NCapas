using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicaEntidades
{
    public class Cita
    {
        public int IdCita { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public DoctorHorarioDetalle DoctorHorarioDetalle { get; set; } = null!;
        public EstadoCita EstadoCita { get; set; } = null!;
        public string FechaCita { get; set; } = null!;
        public string FechaCreacion { get; set; } = null!;
        public string Indicaciones { get; set; } = null!;

        public Especialidad Especialidad { get; set; } = null!;
        public Doctor Doctor { get; set; } = null!;
        public string HoraCita { get; set; } = null!;

    }
}
