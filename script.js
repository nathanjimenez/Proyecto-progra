function submitForm() {
    const cliente = document.getElementById('cliente').value;
    const tecnico = document.getElementById('tecnico').value;
    const fecha = document.getElementById('fecha').value;
    const numeroIncidencia = document.getElementById('numeroIncidencia').value;
    const modelo = document.getElementById('modelo').value;
    const serie = document.getElementById('serie').value;
    const motivoServicio = document.getElementById('motivoServicio').value;
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const cantidad = document.getElementById('cantidad').value;

    const data = {
        cliente,
        tecnico,
        fecha,
        numeroIncidencia,
        modelo,
        serie,
        motivoServicio,
        codigo,
        descripcion,
        cantidad
    };

    fetch('http://localhost:3000/api/boletas', {
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

