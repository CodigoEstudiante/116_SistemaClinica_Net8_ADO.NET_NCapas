let tablaData;
let idEditar = 0;
const controlador = "Doctor";
const modal = "mdData";
const preguntaEliminar = "Desea eliminar al doctor";
const confirmaEliminar = "El doctor fue eliminado.";
const confirmaRegistro = "Doctor registrado!";

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
            { title: "Nro Documento", "data": "numeroDocumentoIdentidad", width:"150px" },
            { title: "Nombres", "data": "nombres" },
            { title: "Apellidos", "data": "apellidos" },
            { title: "Genero", "data": "genero" },
            {
                title: "Especialidad", "data": "especialidad", render: function (data, type, row) {
                    return data.nombre
                }
            },
            { title: "Fecha Creacion", "data": "fechaCreacion" },
            {
                title: "", "data": "idDoctor", width: "100px", render: function (data, type, row) {
                    return `<div class="btn-group dropstart">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Acción
                        </button>
                        <ul class="dropdown-menu">
                            <li><button class="dropdown-item btn-editar">Editar</button></li>
                            <li><button class="dropdown-item btn-eliminar">Eliminar</button></li>
                        </ul>`
                }
            }
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });

    fetch(`/Especialidad/Lista`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }).then(response => {
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {
        if (responseJson.data.length > 0) {
            $("#cboEspecialidad").append($("<option>").val("").text(""));
            responseJson.data.forEach((item) => {
                $("#cboEspecialidad").append($("<option>").val(item.idEspecialidad).text(item.nombre));
            });
            $('#cboEspecialidad').select2({
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

    $("#cboGenero").append($("<option>").val("").text(""));
    $("#cboGenero").append($("<option>").val("F").text("Femenino"));
    $("#cboGenero").append($("<option>").val("M").text("Masculino"));

    $('#cboGenero').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#mdData'),
        placeholder: "Seleccionar"
    });

});


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
    $("#txtNroDocumento").val("");
    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#cboEspecialidad").val("").trigger('change');
    $(`#${modal}`).modal('show');
})

$("#tbData tbody").on("click", ".btn-eliminar", function () {
    var filaSeleccionada = $(this).closest('tr');
    var data = tablaData.row(filaSeleccionada).data();


    Swal.fire({
        text: `${preguntaEliminar} ${data.nombres} ${data.apellidos}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, continuar",
        cancelButtonText: "No, volver"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`/${controlador}/Eliminar?Id=${data.idDoctor}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            }).then(response => {
                return response.ok ? response.json() : Promise.reject(response);
            }).then(responseJson => {
                if (responseJson.data == 1) {
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
    if ($("#txtNroDocumento").val().trim() == "" ||
        $("#txtNombres").val().trim() == "" ||
        $("#txtApellidos").val().trim() == "" ||
        $("#cboGenero").val() == "" ||
        $("#cboEspecialidad").val() == ""
    ) {
        Swal.fire({
            title: "Error!",
            text: "Falta completar datos.",
            icon: "warning"
        });
        return
    }
    
    let objeto = {
        IdDoctor: idEditar,
        NumeroDocumentoIdentidad: $("#txtNroDocumento").val().trim(),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        Genero: $("#cboGenero").val(),
        Especialidad: {
            IdEspecialidad: $("#cboEspecialidad").val()
        }
    }

    if (idEditar != 0) {

        fetch(`/${controlador}/Editar`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(objeto)
        }).then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        }).then(responseJson => {
            if (responseJson.data == "") {
                idEditar = 0;
                Swal.fire({
                    text: "Se guardaron los cambios!",
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
                text: "No se pudo editar.",
                icon: "warning"
            });
        })
    } else {
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
    }
});