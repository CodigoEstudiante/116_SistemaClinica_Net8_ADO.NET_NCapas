using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicaEntidades
{
    public class DoctorHorarioDetalle
    {
        public int IdDoctorHorarioDetalle { get; set; }
        public DoctorHorario DoctorHorario { get; set; } = null!;
        public string Fecha { get; set; } = null!;
        public string Turno { get; set; } = null!;
        public string TurnoHora { get; set; } = null!;
        public bool Reservado { get; set; }
        public string FechaCreacion { get; set; } = null!;

    }
}
