var express = require('express');

var app = express();

const path = require('path');
const fileSystem = require('fs');




app.get('/:kind/:img', (req, res, next) => {

    var kind = req.params.kind;
    var img = req.params.img;

    var imgPath = path.resolve(__dirname, `../uploads/${ kind }/${ img }`)

    if (fileSystem.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        var noImgPath = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(noImgPath);

    }

});

module.exports = app;