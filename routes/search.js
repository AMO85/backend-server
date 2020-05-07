var express = require('express');

var app = express();
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var Usuario = require('../models/usuario');

//BUSQUEDA POR COLECCIONES'/coleccion/:tabla/:search' hacen parte de la url
app.get('/coleccion/:tabla/:search', (req, res) => {

    var search = req.params.search;
    var tabla = req.params.tabla;
    var promesa;
    //creacion de variable para busqueda insencible que reaccione a mayusMinus 
    var regex = new RegExp(search, 'i');


    switch (tabla) {
        case 'usuarios':
            promesa = searchUsuarios(search, regex)
            break;

        case 'doctors':
            promesa = searchDoctors(search, regex)
            break;

        case 'hospitales':
            promesa = searchHospitals(search, regex)
            break;

        default:
            return res.status(400).json({
                ok: true,
                mensaje: 'no es una busqueda permitida',
                error: { message: 'ese parametro no existe en la BD' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});



//BUSQUEDA EN TODAS LAS COLECCIONES'/todo/:search' hacen parte de la url
app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    //creacion de variable para busqueda insencible que reaccione a mayusMinus 
    var regex = new RegExp(search, 'i');

    //funcion ECMAScript6
    Promise.all([
            searchHospitals(search, regex),
            searchDoctors(search, regex),
            searchUsuarios(search, regex)
        ])
        .then(answer => {

            res.status(200).json({

                ok: true,
                hospitales: answer[0],
                doctores: answer[1],
                usuarios: answer[2]

            });

        })
});


function searchHospitals(search, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al buscar hospitales', err);
                } else {
                    resolve(hospitales)

                }
            })
    });
}

function searchDoctors(search, regex) {

    return new Promise((resolve, reject) => {

        Doctor.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, doctores) => {

                if (err) {
                    reject('Error al buscar doctores')
                } else {
                    resolve(doctores)

                }

            });
    });
}

function searchUsuarios(search, regex) {

    return new Promise((resolve, reject) => {

        //funcion buscar de mongoose no sepone la contraseña, no es buena practica
        Usuario.find({}, 'nombre email role')
            //esta funcion nos deja buscar por 2 parametros
            .or([{ 'nombre': regex }, { 'email': regex }])
            //para ejecutar el query retorna sea el error o el usuario
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar usuarios')
                } else {
                    resolve(usuarios);

                }

            })

    });
}



module.exports = app;