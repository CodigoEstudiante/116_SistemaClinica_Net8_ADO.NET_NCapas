let Especialidades = [];
let Doctores = [];
let DoctorHorario = [];
const modal = "mdData";
let IdEspecialidadSeleccionada = 0;
let IdDoctorSeleccionado = 0;
let IdHoraSeleccionado = 0;
let EspecialidadSeleccionada = "";
let DoctorSeleccionado = "";
let HoraSeleccionado = "";

const IndexTabs = [0,1,2]


document.addEventListener("DOMContentLoaded", function (event) {
    $.datepicker.setDefaults($.datepicker.regional['es']);
    $("#tabs").tabs();
    $("#txtBuscarEspecialidad").trigger("focus");
    


    $("#tab-especialidad").LoadingOverlay("show");
    fetch(`/Especialidad/Lista`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        $("#tab-especialidad").LoadingOverlay("hide");
        if (responseJson.data.length > 0) {
            Especialidades = responseJson.data;
            BuscarEspecialidad("");
        }
    }).catch((error) => {
        $("#tab-especialidad").LoadingOverlay("hide");
        console.log(error)
        Swal.fire({
            title: "Error!",
            text: "No se encontraron coincidencias.",
            icon: "warning"
        });
    })

 
    $("#tabs").tabs("option", "disabled", [1, 2]);
    $("#btnSiguiente").prop("disabled", true);
    
});

$("#txtBuscarEspecialidad").on("input", function () {

    IdEspecialidadSeleccionada = 0;
    BuscarEspecialidad($(this).val());
    $("#btnSiguiente").prop("disabled", true);
});
$("#txtBuscarDoctor").on("input", function () {

    IdDoctorSeleccionado = 0;
    BuscarDoctor($(this).val());
    $("#btnSiguiente").prop("disabled", true);
});


$(document).on("click", "div.card-especialidad", function () {

    $(".card-especialidad").removeClass("text-white bg-primary");
    $(this).addClass("text-white bg-primary");
    IdEspecialidadSeleccionada = $(this).data("id");
    EspecialidadSeleccionada = $(this).data("text");
    $("#btnSiguiente").prop("disabled", false);
});

$(document).on("click", "div.card-doctor", function () {

    $(".card-doctor").removeClass("text-white bg-primary");
    $(this).addClass("text-white bg-primary");
    IdDoctorSeleccionado = $(this).data("id");
    DoctorSeleccionado = $(this).data("text");
    $("#btnSiguiente").prop("disabled", false);
});

$(document).on("click", "div.card-hora", function () {

    $(".card-hora").removeClass("text-white bg-primary");
    $(this).addClass("text-white bg-primary");
    IdHoraSeleccionado = $(this).data("id");
    HoraSeleccionado = $(this).data("text");

    if ($("#txtFechaCita").val() != "" && IdHoraSeleccionado != 0)
        $("#btnSiguiente").prop("disabled", false);
});


function BuscarEspecialidad(valor) {
    $("#contenedor-especialidades").html("")
    const resultadosFiltrados = Especialidades.filter(element => element.nombre.toLowerCase().includes(valor.toLowerCase()));
    const resumenFiltro = resultadosFiltrados.slice(0, 4);

    resumenFiltro.forEach(function (item) {
        $("#contenedor-especialidades").append(
            `<div class="col mb-4">
                <div class="card h-100 card-especialidad" style="cursor: pointer" data-id="${item.idEspecialidad}" data-text="${item.nombre}">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fa-solid fa-clipboard"></i> ${item.nombre}</h5>
                    </div>
                </div>
            </div>`
        )
    })
}

function BuscarDoctor(valor) {
    $("#contenedor-doctores").html("")
    const resultadosFiltrados = Doctores.filter(element => (element.nombres + element.apellidos).toLowerCase().includes(valor.toLowerCase()));
    resultadosFiltrados.forEach(function (item) {
        const acronimo = item.genero == "F" ? "Dra.":"Dr."
        $("#contenedor-doctores").append(
            `<div class="col mb-4">
                <div class="card h-100 card-doctor" style="cursor: pointer" data-id="${item.idDoctor}" data-text="${acronimo} ${item.nombres} ${item.apellidos}">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fa-solid fa-user-doctor"></i> ${acronimo} ${item.nombres} ${item.apellidos}</h5>
                    </div>
                </div>
            </div>`
        )
    })
}


$("#btnSiguiente").on("click", function () {
    const indexTab = $("ul li.ui-state-active").index();

    let habilitarIndex = indexTab;
    if (indexTab + 1 <= 2) {

        habilitarIndex = indexTab + 1;
        bloquearIndex = IndexTabs.filter((i) => i != habilitarIndex);
        $("#tabs").tabs("option", "disabled", bloquearIndex);
        $("#tabs").tabs({ active: habilitarIndex });
        $("#btnSiguiente").prop("disabled", true);

        if (habilitarIndex == 1) {
            $("#txtBuscarDoctor").val("");
            $("#txtBuscarDoctor").trigger("focus");
            ObtenerDoctores()
        } else if (habilitarIndex == 2) {
            
            $("#txtFechaCita").val("");
            ObtenerDoctoreHorarioDetalle()

           
        }
    }
    if (indexTab == 2) {
        $("#txtEspecialidad").val(EspecialidadSeleccionada);
        $("#txtDoctor").val(DoctorSeleccionado);
        $("#txtFechadeCita").val($("#txtFechaCita").val());
        $("#txtHoraCita").val(HoraSeleccionado);
        $("#mdData").modal("show")
    }
    
});

$("#btnRegresar").on("click", function () {

    const indexTab = $("ul li.ui-state-active").index();
    let habilitarIndex = indexTab;
    if (indexTab - 1 >= 0) habilitarIndex = indexTab - 1;

    bloquearIndex = IndexTabs.filter((i) => i != habilitarIndex);
    $("#tabs").tabs("option", "disabled", bloquearIndex);
    $("#tabs").tabs({ active: habilitarIndex });
    $("#btnSiguiente").prop("disabled", true);

    if (habilitarIndex == 0) {
        $("#txtBuscarEspecialidad").val("");
        $("#txtBuscarEspecialidad").trigger("focus");
        $(".card-especialidad").removeClass("text-white bg-primary");
        BuscarEspecialidad("");
    } else if (habilitarIndex == 1) {
        $("#txtBuscarDoctor").val("");
        $("#txtBuscarDoctor").trigger("focus");
        $(".card-doctor").removeClass("text-white bg-primary");
        BuscarDoctor("");
    }
});


function ObtenerDoctores() {
    $("#tab-doctor").LoadingOverlay("show");

    fetch(`/Doctor/Lista`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        if (responseJson.data.length > 0) {
            Doctores = responseJson.data.filter(element => element.especialidad.idEspecialidad == IdEspecialidadSeleccionada);
            BuscarDoctor("")
        }
        $("#tab-doctor").LoadingOverlay("hide");
    }).catch((error) => {
        $("#tab-doctor").LoadingOverlay("hide");
        console.log(error)
        Swal.fire({
            title: "Error!",
            text: "No se encontraron coincidencias.",
            icon: "warning"
        });
    })

}

function ObtenerDoctoreHorarioDetalle() {
    $("#txtFechaCita").datepicker("destroy");
    $("#tab-horario").LoadingOverlay("show");
    $("#contenedor-am").html("");
    $("#contenedor-pm").html("");

    fetch(`/Citas/ListaDoctorHorarioDetalle?Id=${IdDoctorSeleccionado}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
      
        if (responseJson.data.length > 0) {
            const arraySoloFechas = responseJson.data.map(item => item.fecha);
            DoctorHorario = responseJson.data

            $("#txtFechaCita").datepicker({
                defaultDate: "",
                minDate: 0,
                beforeShowDay: function (date) {
                    // Formatear la fecha actual al formato "YYYY-MM-DD"
                    var formattedDate = $.datepicker.formatDate("dd/mm/yy", date);
                    // Verificar si la fecha está en el array de fechas permitidas
                    var esFechaPermitida = ($.inArray(formattedDate, arraySoloFechas) !== -1);
                    // Habilitar o deshabilitar la fecha en el calendario
                    return [esFechaPermitida, ""];
                },
                onSelect: function (dateText, inst) {
                    $("#btnSiguiente").prop("disabled", true);
                    $("#contenedor-am").html("");
                    $("#contenedor-pm").html("");

                    const selectedDate = $(this).val();
                    
                    const Fecha = DoctorHorario.find(element => element.fecha == selectedDate);
  
                    const HorarioAM = Fecha.horarioDTO.filter(element => element.turno == "AM");
                    const HorarioPM = Fecha.horarioDTO.filter(element => element.turno == "PM");
                    HorarioAM.forEach(function (item) {
                        $("#contenedor-am").append(
                            `<div class="col mb-4" >
                                <div class="text-center card-hora" style="cursor: pointer;border-radius: 0.375rem;border: 1px solid #ccc !important;" data-id="${item.idDoctorHorarioDetalle}" data-text="${item.turnoHora}">
                                    <h6 class="card-title mt-2">${item.turnoHora}</h6>
                                </div>
                             </div>`
                        )
                    })
                    HorarioPM.forEach(function (item) {
                        $("#contenedor-pm").append(
                            `<div class="col mb-4" >
                                <div class="text-center card-hora" style="cursor: pointer;border-radius: 0.375rem;border: 1px solid #ccc !important;" data-id="${item.idDoctorHorarioDetalle}" data-text="${item.turnoHora}">
                                    <h6 class="card-title mt-2">${item.turnoHora}</h6>
                                </div>
                             </div>`
                        )
                    })
                }
            });

          
        } else {
            Swal.fire({
                text: "No hay horarios disponibles.",
                icon: "warning"
            });
        }
        $("#tab-horario").LoadingOverlay("hide");
    }).catch((error) => {
        $("#tab-horario").LoadingOverlay("hide");
        Swal.fire({
            title: "Error!",
            text: "No se encontraron coincidencias.",
            icon: "warning"
        });
    })
}

$("#btnAgendar").on("click", function () {

    if ($("#txtFechaCita").val() == "" && IdHoraSeleccionado == 0) {
        Swal.fire({
            title: "Error!",
            text: "Falta completar datos.",
            icon: "warning"
        });
        return
    }
    
    let objeto = {
        DoctorHorarioDetalle: {
            IdDoctorHorarioDetalle: IdHoraSeleccionado
        },
        EstadoCita: {
            IdEstadoCita: 1
        },
        FechaCita: moment($("#txtFechaCita").val(), "DD/MM/YYYY").format('DD/MM/YYYY')
    }

    fetch(`/Citas/Guardar`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(objeto)
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        
        if (responseJson.data == "") {
            Swal.fire({
                title: "Felicidades!",
                text: "Su cita fue registrada!",
                icon: "success"
            }).then(function () {
                window.location.href = '/Citas/Index'
            });
            $(`#${modal}`).modal('hide');
        } else {
            Swal.fire({
                title: "Error!",
                text: responseJson.data,
                icon: "warning"
            });
        }
    }).catch((error) => {
        Swal.fire({
            title: "Error!",
            text: "No se pudo registrar.",
            icon: "warning"
        });
    })
})