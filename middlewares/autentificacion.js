var jwt = require('jsonwebtoken');

//SEED parametrizado para el jwt
var SEED = require('../config/config').SEED;

//MIDDLEWARE VERIFICACION DEL TOKEN
exports.tokenVerified = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mesaje: 'Error con el token',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

}