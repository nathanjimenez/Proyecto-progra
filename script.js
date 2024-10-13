// Función para agregar fila a la tabla de repuestos
function agregarFila() {
    let codigo = document.getElementById("codigo").value;
    let descripcion = document.getElementById("descripcion").value;
    let cantidad = document.getElementById("cantidad").value;
    let estado = document.getElementById("estado").value;

    if (codigo && descripcion && cantidad) {
        let newRow = `<tr>
            <td>${codigo}</td>
            <td>${descripcion}</td>
            <td>${cantidad}</td>
            <td>${estado}</td>
        </tr>`;
        document.getElementById("tabla-repuestos").querySelector('tbody').innerHTML += newRow;

        // Limpiar los campos
        document.getElementById("codigo").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("cantidad").value = "";
        document.getElementById("estado").value = "";
    } else {
        alert("Por favor, completa todos los campos antes de agregar un repuesto.");
    }
}

// Función para enviar los datos del formulario
function submitForm() {
    const cliente = document.getElementById('cliente').value;
    const tecnico = document.getElementById('tecnico').value;
    const fecha = document.getElementById('fecha').value;
    const numeroIncidencia = document.getElementById('numeroIncidencia').value;
    const modelo = document.getElementById('modelo').value;
    const serie = document.getElementById('serie').value;
    const motivoServicio = document.getElementById('motivoServicio').value;
    const condicionEquipo = document.getElementById('condicion_equipo').value;
    const accionTomada = document.getElementById('accion_tomada').value;

    const horaInicialViaje = document.getElementById('hora_inicial_viaje').value;
    const horaFinalViaje = document.getElementById('hora_final_viaje').value;
    const horaInicialTrabajo = document.getElementById('hora_inicial_trabajo').value;
    const horaFinalTrabajo = document.getElementById('hora_final_trabajo').value;

    const vn = document.getElementById('vn').value;
    const nt = document.getElementById('nt').value;
    const vt = document.getElementById('vt').value;

    const repuestos = [];
    const codigos = document.querySelectorAll('[name="codigo[]"]');
    const descripciones = document.querySelectorAll('[name="descripcion[]"]');
    const cantidades = document.querySelectorAll('[name="cantidad[]"]');
    const estados = document.querySelectorAll('[name="estado[]"]');

    for (let i = 0; i < codigos.length; i++) {
        repuestos.push({
            codigo: codigos[i].value,
            descripcion: descripciones[i].value,
            cantidad: cantidades[i].value,
            estado: estados[i].value
        });
    }

    const data = {
        cliente,
        tecnico,
        fecha,
        numeroIncidencia,
        modelo,
        serie,
        motivoServicio,
        condicionEquipo,
        accionTomada,
        horaInicialViaje,
        horaFinalViaje,
        horaInicialTrabajo,
        horaFinalTrabajo,
        vn,
        nt,
        vt,
        repuestos 
    };

    fetch('http://localhost:3000/guardarReporte', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Reporte enviado correctamente';
            document.getElementById('boletaForm').reset(); // Limpiar el formulario
        } else {
            document.getElementById('responseMessage').innerText = 'Error al enviar el reporte';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').innerText = 'Error en la conexión con el servidor';
    });
}
