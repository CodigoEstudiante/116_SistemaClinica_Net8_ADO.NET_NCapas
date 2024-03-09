let tablaData;
let idEditar = 0;
const controlador = "DoctorHorario";
const modal = "mdData";
const preguntaEliminar = "Desea eliminar el horario";
const confirmaEliminar = "El horario fue eliminado.";
const confirmaRegistro = "Horario registrado!";
const meses = [{ value: 1, text: "Enero" }, { value: 2, text: "Febrero" }, { value: 3, text: "Marzo" }, { value: 4, text: "Abril" },
    { value: 5, text: "Mayo" }, { value: 6, text: "Junio" }, { value: 7, text: "Julio" }, { value: 8, text: "Agosto" }, { value: 9, text: "Septiembre" }
    , { value: 10, text: "Octubre" }, { value: 11, text: "Noviembre" }, { value: 12, text: "Diciembre" }]
const mesActual = new Date().getMonth() + 1;

document.addEventListener("DOMContentLoaded", function (event) {
   
    tablaData = $('#tbData').DataTable({
        responsive: true,
        scrollX: true,
        "ajax": {
            "url": `/${controlador}/Lista`,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                title: "Nro Documento", "data": "doctor", width: "150px",render: function (data, type, row) {
                    return data.numeroDocumentoIdentidad
                }
            },
            {
                title: "Doctor", "data": "doctor", render: function (data, type, row) {
                    return `${data.nombres} ${data.apellidos}`
                }
            },
            {
                title: "Mes", "data": "numeroMes", render: function (data, type, row) {
                    const mes = meses.find((m) => m.value == data);
                    return mes.text;
                }
            },
            { title: "Hora Inicio AM", "data": "horaInicioAM" },
            { title: "Hora Fin AM", "data": "horaFinAM" },
            { title: "Hora Inicio PM", "data": "horaInicioPM" },
            { title: "Hora Fin PM", "data": "horaFinPM" },
            
            { title: "Fecha Creacion", "data": "fechaCreacion" },
            {
                title: "", "data": "idDoctor", width: "100px", render: function (data, type, row) {
                    return `<button type="button" class="btn btn-sm btn-outline-danger me-1 btn-eliminar"><i class="fas fa-trash"></i></button>`
                }
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });

    $('#txtHoraFinAM').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '08',
        maxTime: '11:30am',
        startTime: '08:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 9999999
    });

    $('#txtHoraInicioAM').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '08',
        maxTime: '11:30am',
        startTime: '08:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 9999999,
        change: MostrarHoraFinAM
    });

    $('#txtHoraFinPM').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '12',
        maxTime: '19:30PM',
        startTime: '12:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 9999999
    });

    $('#txtHoraInicioPM').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '12',
        maxTime: '19:30PM',
        startTime: '12:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 9999999,
        change: MostrarHoraFinPM
    });
   

    fetch(`/Doctor/Lista`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        if (responseJson.data.length > 0) {
            $("#cboDoctor").append($("<option>").val("").text(""));
            responseJson.data.forEach((item) => {
                $("#cboDoctor").append($("<option>").val(item.idDoctor).text(`${item.numeroDocumentoIdentidad} - ${item.nombres} ${item.apellidos}`));
            });
            $('#cboDoctor').select2({
                theme: 'bootstrap-5',
                dropdownParent: $('#mdData'),
                placeholder: "Seleccionar"
            });
        }
    }).catch((error) => {
        Swal.fire({
            title: "Error!",
            text: "No se encontraron coincidencias.",
            icon: "warning"
        });
    })

    const mesesActivos = meses.filter((m) => m.value >= mesActual);
    $("#cboMesAtencion").append($("<option>").val("").text(""));
    mesesActivos.forEach( (m) =>{
        $("#cboMesAtencion").append($("<option>").val(m.value).text(m.text));
    })
    $('#cboMesAtencion').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#mdData'),
        placeholder: "Seleccionar"
    });

});

function MostrarHoraFinAM() {
  
    const Hora = moment($("#txtHoraInicioAM").val(), "HH:mm");
    Hora.add(moment.duration("00:30"))
    $('#txtHoraFinAM').val('');
    $('#txtHoraFinAM').timepicker('option', 'minTime', Hora.format('HH:mm'))
    $('#txtHoraFinAM').timepicker('option', 'startTime', Hora.format('HH:mm'))
  
}
function MostrarHoraFinPM() {
    const Hora = moment($("#txtHoraInicioPM").val(), ['h:mm A']);
    Hora.add(moment.duration("00:30"))
    $('#txtHoraFinPM').val('');
    $('#txtHoraFinPM').timepicker('option', 'minTime', Hora.format('HH:mm'))
    $('#txtHoraFinPM').timepicker('option', 'startTime', Hora.format('HH:mm'))
}

$("#tbData tbody").on("click", ".btn-editar", function () {
    var filaSeleccionada = $(this).closest('tr');
    var data = tablaData.row(filaSeleccionada).data();

    idEditar = data.idDoctor;
    $("#txtNroDocumento").val(data.numeroDocumentoIdentidad);
    $("#txtNombres").val(data.nombres);
    $("#txtApellidos").val(data.apellidos);
    $("#cboGenero").select2("val", data.genero);
    $("#cboEspecialidad").select2("val", data.especialidad.idEspecialidad.toString());
    $(`#${modal}`).modal('show');
})


$("#btnNuevo").on("click", function () {
    idEditar = 0;
    $("#cboDoctor").val("").trigger('change');
    $("#cboMesAtencion").val("").trigger('change');
    $("#txtHoraInicioAM").val("")
    $("#txtHoraFinAM").val("")
    $("#txtHoraInicioPM").val("")
    $("#txtHoraFinPM").val("")
    $("#txtFechaAtencion").val("")
    $(`#${modal}`).modal('show');
})

$("#tbData tbody").on("click", ".btn-eliminar", function () {
    var filaSeleccionada = $(this).closest('tr');
    var data = tablaData.row(filaSeleccionada).data();


    Swal.fire({
        text: `${preguntaEliminar}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, continuar",
        cancelButtonText: "No, volver"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`/${controlador}/Eliminar?Id=${data.idDoctorHorario}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            }).then(response => {
                return response.ok ? response.json() : Promise.reject(response);
            }).then(responseJson => {
                if (responseJson.data == "") {
                    Swal.fire({
                        title: "Eliminado!",
                        text: confirmaEliminar,
                        icon: "success"
                    });
                    tablaData.ajax.reload();
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "No se pudo eliminar.",
                        icon: "warning"
                    });
                }
            }).catch((error) => {
                Swal.fire({
                    title: "Error!",
                    text: "No se pudo eliminar.",
                    icon: "warning"
                });
            })
        }
    });
})



$("#btnGuardar").on("click", function () {

    if ($("#cboDoctor").val().trim() == "" ||
        $("#txtHoraInicioAM").val().trim() == "" ||
        $("#txtHoraFinAM").val().trim() == "" ||
        $("#txtHoraInicioPM").val() == "" ||
        $("#txtHoraFinPM").val() == ""
    ) {
        Swal.fire({
            title: "Error!",
            text: "Falta completar datos.",
            icon: "warning"
        });
        return
    }

    const HoraInicioAM = moment($("#txtHoraInicioAM").val(), "HH:mm")
    const HoraFinAM = moment($("#txtHoraFinAM").val(), "HH:mm")
    const HoraInicioPM = moment($("#txtHoraInicioPM").val(), ['h:mm A'])
    const HoraFinPM = moment($("#txtHoraFinPM").val(), ['h:mm A'])

    const objeto = {
        IdDoctorHorario: idEditar,
        Doctor: {
            IdDoctor: $("#cboDoctor").val(),
        },
        NumeroMes: $("#cboMesAtencion").val(),
        HoraInicioAM: HoraInicioAM.format('HH:mm'),
        HoraFinAM: HoraFinAM.format('HH:mm'),
        HoraInicioPM: HoraInicioPM.format('HH:mm'),
        HoraFinPM: HoraFinPM.format('HH:mm'),
        DoctorHorarioDetalle: {
            Fecha: $('#txtFechaAtencion').val().replace(/\n/g, ',').trim()
        }
    }

    fetch(`/${controlador}/Guardar`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(objeto)
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        if (responseJson.data == "") {
            Swal.fire({
                text: confirmaRegistro,
                icon: "success"
            });
            $(`#${modal}`).modal('hide');
            tablaData.ajax.reload();
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
});