// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//inicalizar variables
var app = express();

//BODYPARSER
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//inicalizar rutas from routes
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');



//conexion dB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('DB: \x1b[32m%s\x1b[0m', 'online');


})

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3mil: \x1b[32m%s\x1b[0m', 'online');

})