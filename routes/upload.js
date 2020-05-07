var express = require('express');

var fileUpload = require('express-fileupload');

var fileSystem = require('fs');
var app = express();

var User = require('../models/usuario');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');


//middleware
app.use(fileUpload());

app.put('/:kind/:id', (req, res, next) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no ha seleccionado nada aun',
            errors: { message: 'selecciona una imagen' }
        });
    }

    var kind = req.params.kind;
    var id = req.params.id;

    //collections kind
    var validCollectionKind = ["users", "doctors", "hospitals"];
    if (validCollectionKind.indexOf(kind) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no es una coleccion valida',
            errors: { message: 'NOT a Valid Collection' }
        });
    }

    //obtener el nombre del archivo
    var file = req.files.imagen;
    var cuttingName = file.name.split('.');
    var kindOfFile = cuttingName[cuttingName.length - 1];

    //tipo de archivos validos
    var validKindOfFile = ['png', 'jpg', 'gif', 'jpeg'];

    if (validKindOfFile.indexOf(kindOfFile) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de archivo no permitido',
            errors: { message: 'recuerde solo se pueden estos 4 tipos de archivos ' + validKindOfFile.join(', ') }
        });
    }

    //nombre del archivo se pone el (id de la coleccion)(un guion -)(ylos milisegundos de la fecha)(y la extension del archivo)
    //exaple 123141332-145.jpg
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${ kindOfFile }`;

    //mover el archivo a un path
    var path = `./uploads/${ kind }/${ fileName }`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al mover el archivo',
                errors: err
            });
        }

        uploadByKind(kind, id, fileName, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'file moved succefully',
        //     cuttingName: cuttingName,
        //     kindOfFile: kindOfFile
        // });

    })




});


function uploadByKind(kind, id, fileName, res) {

    if (kind === 'users') {

        User.findById(id, (err, usuario) => {

            // el unlink de node elimina la img vieja
            var oldPath = './uploads/users' + usuario.img;
            if (fileSystem.existsSync(oldPath)) {
                fileSystem.unlink(oldPath);
            }

            usuario.img = fileName;
            usuario.save((err, userUpdated) => {

                userUpdated.password = 'not avalible';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'user image updated',
                    usuario: userUpdated
                });

            })

        });



    }

    if (kind === 'doctors') {

        Doctor.findById(id, (err, doctor) => {

            // el unlink de node elimina la img vieja
            var oldPath = './uploads/doctors' + doctor.img;
            if (fileSystem.existsSync(oldPath)) {
                fileSystem.unlink(oldPath);
            }

            doctor.img = fileName;
            doctor.save((err, doctorUpdated) => {

                doctorUpdated.password = 'not avalible';


                return res.status(200).json({
                    ok: true,
                    mensaje: 'doctor image updated',
                    usuario: doctorUpdated
                });

            })

        });

    }

    if (kind === 'hospitals') {

        Hospital.findById(id, (err, hospital) => {

            // el unlink de node elimina la img vieja
            var oldPath = './uploads/hospitals' + hospital.img;
            if (fileSystem.existsSync(oldPath)) {
                fileSystem.unlink(oldPath);
            }

            hospital.img = fileName;
            hospital.save((err, hospitalUpdated) => {

                hospitalUpdated.password = 'not avalible';


                return res.status(200).json({
                    ok: true,
                    mensaje: 'hospital image updated',
                    usuario: hospitalUpdated
                });

            })

        });
    }

}

module.exports = app;