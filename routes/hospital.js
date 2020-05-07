var express = require('express');

var mdAutentificacion = require('../middlewares/autentificacion')

//SEED parametrizado para el jwt
var SEED = require('../config/config').SEED;

var app = express();

var Hospital = require('../models/hospital');

//obtener todo de hospital
app.get('/', (req, res, next) => {

    //para paginacion
    var desde = req.query.desde || 0;
    desde = Number(desde);

    //funciones mongoose:  skipt limit para paginacion
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesaje: 'Error cargando hospital',
                        errors: err
                    });
                }
                //en mayuscula Hospital pq hace referencia al modelo  //para paginacion funcion count variable conteo 
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                })



            })


});


//actualizar hospital
app.put('/:id', mdAutentificacion.tokenVerified, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al encontrar el hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el' + id + 'no existe',
                errors: { message: 'No existe tal hospital' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no actualizado',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });


});


//crear nuevo hospital
app.post('/', mdAutentificacion.tokenVerified, (req, res) => {

    var body = req.body;

    //se crea el objeto de tipo hospital
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
})

//eliminar hospital
app.delete('/:id', mdAutentificacion.tokenVerified, (req, res) => {

    var id = req.params.id;


    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no se pudo eliminar',
                errors: err
            });
        }

        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital no existe',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });

    });

});



module.exports = app;