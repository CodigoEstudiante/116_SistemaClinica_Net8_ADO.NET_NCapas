let tablaData;
let idEditar = 0;
const controlador = "Usuario";
const modal = "mdData";
const preguntaEliminar = "Desea eliminar al usuario";
const confirmaEliminar = "El usuario fue eliminado.";
const confirmaRegistro = "Usuario registrado!";

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
            { title: "Nro Documento", "data": "numeroDocumentoIdentidad", width: "150px" },
            { title: "Nombres", "data": "nombre" },
            { title: "Apellidos", "data": "apellido" },
            { title: "Correo", "data": "correo" },
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

});


$("#tbData tbody").on("click", ".btn-editar", function () {
    const filaSeleccionada = $(this).closest('tr');
    const data = tablaData.row(filaSeleccionada).data();

    idEditar = data.idUsuario;
    $("#txtNroDocumento").val(data.numeroDocumentoIdentidad);
    $("#txtNombres").val(data.nombre);
    $("#txtApellidos").val(data.apellido);
    $("#txtCorreo").val(data.correo);
    $("#txtClave").val(data.clave);
    $(`#${modal}`).modal('show');
})


$("#btnNuevo").on("click", function () {
    idEditar = 0;
    $("#txtNroDocumento").val("");
    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtCorreo").val("");
    $("#txtClave").val("");
    $(`#${modal}`).modal('show');
})

$("#tbData tbody").on("click", ".btn-eliminar", function () {
    var filaSeleccionada = $(this).closest('tr');
    var data = tablaData.row(filaSeleccionada).data();


    Swal.fire({
        text: `${preguntaEliminar} ${data.nombre} ${data.apellido}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, continuar",
        cancelButtonText: "No, volver"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`/${controlador}/Eliminar?Id=${data.idUsuario}`, {
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
        $("#txtCorreo").val() == "" ||
        $("#txtClave").val() == ""
    ) {
        Swal.fire({
            title: "Error!",
            text: "Falta completar datos.",
            icon: "warning"
        });
        return
    }

    const objeto = {
        IdUsuario: idEditar,
        NumeroDocumentoIdentidad: $("#txtNroDocumento").val().trim(),
        Nombre: $("#txtNombres").val().trim(),
        Apellido: $("#txtApellidos").val().trim(),
        Correo: $("#txtCorreo").val(),
        Clave: $("#txtClave").val(),
        RolUsuario: {
            IdRolUsuario: 1
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