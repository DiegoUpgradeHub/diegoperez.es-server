//Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

//Importamos la conexion a la db
const { connect } = require('./api/utils/database/connect.js');

// Express APIs
const user = require('./api/routes/user.routes.js');
const message = require('./api/routes/message.routes.js');
const task = require('./api/routes/task.routes.js');

//Ejecutamos la funcion que conecta con la db
connect();

// Configuración de express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Aquí indicamos las rutas a usar
app.use('/public', express.static('public'));
app.use('/users', user);
app.use('/messages', message);
app.use('/tasks', task);

// Ruta al HTML. Útil para desplegar en Vercel
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Ruta para añadir estilos con CSS
app.use(express.static(__dirname + '/public'))

// Añadimos el favicon
app.use('/favicon.ico', express.static('public/favicon.ico'));

// Definimos el puerto desde el dotenv y si no lo hubiera el 4000
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Manejamos los errores
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});