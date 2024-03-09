using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicaEntidades.DTO
{
    public class HorarioDTO
    {
        public int IdDoctorHorarioDetalle { get; set; }
        public string Turno { get; set; } = null!;
        public string TurnoHora { get; set; } = null!;
    }
}
