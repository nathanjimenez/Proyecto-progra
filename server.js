const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de conexión a SQL Server
const config = {
    user: '',  // Deja vacío si usas autenticación de Windows
    password: '',  // No se necesita en autenticación de Windows
    server: 'NATHAN\\SQLEXPRESS',  // Nombre del servidor en SQL Server Management Studio
    database: 'BoletasServicio',  // Cambia por el nombre de tu base de datos
    options: {
        trustServerCertificate: true,
        encrypt: true
    }
};

// Ruta para procesar el formulario
app.post('/guardarReporte', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        
        const {
            cliente, tecnico, fecha, nro_incidencia, modelo, serie, motivo_servicio, 
            condicion_equipo, accion_tomada, hora_inicial_viaje, hora_final_viaje, 
            hora_inicial_trabajo, hora_final_trabajo, contometro_inicial, 
            contometro_final, proformar_repuestos, facturar_mano_obra, 
            maquina_operativa, vn, nt, vt, observaciones, codigo, descripcion, cantidad, estado
        } = req.body;

        await pool.request()
            .input('cliente', sql.VarChar, cliente)
            .input('tecnico', sql.VarChar, tecnico)
            .input('fecha', sql.Date, fecha)
            .input('nro_incidencia', sql.Int, nro_incidencia)
            .input('modelo', sql.VarChar, modelo)
            .input('serie', sql.VarChar, serie)
            .input('motivo_servicio', sql.VarChar, motivo_servicio)
            .input('condicion_equipo', sql.VarChar, condicion_equipo)
            .input('accion_tomada', sql.VarChar, accion_tomada)
            .input('hora_inicial_viaje', sql.Time, hora_inicial_viaje)
            .input('hora_final_viaje', sql.Time, hora_final_viaje)
            .input('hora_inicial_trabajo', sql.Time, hora_inicial_trabajo)
            .input('hora_final_trabajo', sql.Time, hora_final_trabajo)
            .input('vn', sql.Float, vn)
            .input('nt', sql.Float, nt)
            .input('vt', sql.Float, vt)
            .input('observaciones', sql.VarChar, observaciones)
            .query(`INSERT INTO Boletas (Cliente, Tecnico, Fecha, NroIncidencia, Modelo, Serie, MotivoServicio, CondicionEquipo, 
                AccionTomada, HoraInicialViaje, HoraFinalViaje, HoraInicialTrabajo, HoraFinalTrabajo, VN, NT, VT, Observaciones)
                VALUES (@cliente, @tecnico, @fecha, @nro_incidencia, @modelo, @serie, @motivo_servicio, @condicion_equipo, 
                @accion_tomada, @hora_inicial_viaje, @hora_final_viaje, @hora_inicial_trabajo, @hora_final_trabajo, 
                @vn, @nt, @vt, @observaciones)`);

        // Manejo de los repuestos
        if (codigo && descripcion && cantidad && estado) {
            for (let i = 0; i < codigo.length; i++) {
                await pool.request()
                    .input('codigo', sql.VarChar, codigo[i])
                    .input('descripcion', sql.VarChar, descripcion[i])
                    .input('cantidad', sql.Int, cantidad[i])
                    .input('estado', sql.VarChar, estado[i])
                    .query(`INSERT INTO Repuestos (Codigo, Descripcion, Cantidad, Estado)
                            VALUES (@codigo, @descripcion, @cantidad, @estado)`);
            }
        }

        res.send('Reporte guardado exitosamente');
    } catch (err) {
        console.error('Error al conectar o guardar en SQL Server:', err);
        res.status(500).send('Error en el servidor');
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
