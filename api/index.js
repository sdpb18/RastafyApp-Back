'use strict' // para usar los nuevos estandares de js.

// libreria para trabajar con la base de dato
// se carga la libreria o modulo.
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.13.139:27017,192.168.13.138:27017,192.168.13.140:27017/rastifyApp?replicaSet=rty0', (err, res) => {
    if(err) {
        console.log(err.message);
        console.log(err);
        throw err;
    }
    else {
       console.log('conectado a mongodb');
       app.listen(port, function(){
            console.log("Servidor escuchando en http://localhost:"+port);
       });
    }
});
