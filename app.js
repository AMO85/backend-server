// Requires
var express = require('express');
var mongoose = require('mongoose');

//inicalizar varianbles
var app = express();

//conexion dB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('DB: \x1b[32m%s\x1b[0m', 'online');


})

//Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada corecctamente'

    });
});

//escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3mil: \x1b[32m%s\x1b[0m', 'online');

})