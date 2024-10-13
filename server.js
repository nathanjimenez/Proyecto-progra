const express = require('express');
const mssql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de la conexión a la base de datos
const config = {
    user: 'RYZEN5600\\Specialist', // Escapa la barra invertida
    password: 'tu_contraseña', // Coloca aquí tu contraseña
    server: 'RYZEN5600\\MSSQLSERVER01', // Nombre del servidor
    database: 'tu_base_de_datos', // Nombre de tu base de datos
    options: {
        encrypt: true, // Usa esto si estás en Azure
        trustServerCertificate: true // Cambia esto según tu configuración
    }
};

    


// Endpoint para insertar datos de Boleta y Repuestos
app.post('/api/boletas', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        
        const { cliente, tecnico, fecha, codigo, descripcion, cantidad } = req.body;

        // Insertar en la tabla Boletas
        const boletaResult = await pool.request()
            .input('Cliente', mssql.VarChar, cliente)
            .input('Tecnico', mssql.VarChar, tecnico)
            .input('Fecha', mssql.Date, fecha)
            .output('NumeroBoleta', mssql.Int) // Para obtener el ID generado
            .execute('sp_insertar_boleta'); // Asegúrate de crear un procedimiento almacenado para la inserción

        const numeroBoleta = boletaResult.output.NumeroBoleta;

        // Insertar en la tabla Repuestos
        await pool.request()
            .input('Codigo', mssql.VarChar, codigo)
            .input('Descripcion', mssql.VarChar, descripcion)
            .input('Cantidad', mssql.Int, cantidad)
            .execute('sp_insertar_repuesto'); // Procedimiento almacenado para la tabla Repuestos

        res.status(201).json({ message: 'Datos insertados correctamente', numeroBoleta });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en la inserción de datos');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
