﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicaEntidades
{
    public class Especialidad
    {
        public int IdEspecialidad { get; set; }
        public string Nombre { get; set; } = null!;
        public string FechaCreacion { get; set; } = null!;
    }
}
