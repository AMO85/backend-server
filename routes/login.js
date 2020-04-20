var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//SEED parametrizado para el jwt
var SEED = require('../config/config').SEED;


var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });

        }

        //CREAR TOKEN

        //se le asigna un valor al password para que no se muestre
        usuarioDB.password = '**404**NOT**FOUNDED**';

        //se crea la variable token con la libreria jsonwebtoken y esta trae tres parametros donde se va a guardar, un SEED y el tiempo, en este caso son 4horas ((14400/60)/60) = 4
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    })

});

module.exports = app;