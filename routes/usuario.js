var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutentificacion = require('../middlewares/autentificacion')

//SEED parametrizado para el jwt
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

//obtener todo de usuarios
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role', )
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesaje: 'Error cargando usuario',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });



            })


});


//actualizar usuario
app.put('/:id', mdAutentificacion.tokenVerified, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al encontrar el  usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el' + id + 'no existe',
                errors: { message: 'No existe tal usuario' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'usuario no actualizado',
                    errors: err
                });
            }

            usuarioGuardado.password = 'contraseña no disponible'

            res.status(201).json({
                ok: true,
                body: usuarioGuardado
            });

        });

    });


});


//crear nuevo usuario
app.post('/', mdAutentificacion.tokenVerified, (req, res) => {

    var body = req.body;

    //se crea el objeto de tipo Usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            body: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
})

//eliminar usuario
app.delete('/:id', mdAutentificacion.tokenVerified, (req, res) => {

    var id = req.params.id;


    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no se pudo eliminar',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario no existe',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });

    });

});



module.exports = app;