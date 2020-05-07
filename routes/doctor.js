var express = require('express');

var mdAutentificacion = require('../middlewares/autentificacion')

//SEED parametrizado para el jwt
var SEED = require('../config/config').SEED;

var app = express();

var Doctor = require('../models/doctor');

//obtener todo de doctor
app.get('/', (req, res, next) => {

    //para paginacion
    var desde = req.query.desde || 0;
    desde = Number(desde);

    //funciones mongoose:  skipt limit para paginacion
    Doctor.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre email')
        .exec(
            (err, doctores) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mesaje: 'Error cargando doctor',
                        errors: err
                    });
                }

                //en mayuscula Doctor pq hace referencia al modelo  //para paginacion funcion count variable conteo 
                Doctor.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        doctores: doctores,
                        total: conteo

                    })

                });



            })


});


//actualizar doctor
app.put('/:id', mdAutentificacion.tokenVerified, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, doctor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al encontrar el doctor',
                errors: err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el' + id + 'no existe',
                errors: { message: 'No existe tal doctor' }
            });
        }

        doctor.nombre = body.nombre;
        doctor.usuario = req.usuario._id;
        doctor.hospital = body.hospital;



        doctor.save((err, doctorGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'doctor no actualizado',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                doctor: doctorGuardado
            });

        });

    });


});


//crear nuevo doctor
app.post('/', mdAutentificacion.tokenVerified, (req, res) => {

    var body = req.body;

    //se crea el objeto de tipo doctor
    var doctor = new Doctor({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    doctor.save((err, doctorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando doctor',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: doctorGuardado
        });
    });
})

//eliminar doctor por el id
app.delete('/:id', mdAutentificacion.tokenVerified, (req, res) => {

    var id = req.params.id;


    Doctor.findByIdAndRemove(id, (err, doctorEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no se pudo eliminar',
                errors: err
            });
        }

        if (!doctorEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el doctor no existe',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            doctor: doctorEliminado
        });

    });

});



module.exports = app;