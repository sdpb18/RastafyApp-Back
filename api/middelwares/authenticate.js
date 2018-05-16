'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_proyecto_bdd'; // llave para decodificar

exports.ensureAuth = function(request, response, next){
  if(!request.headers.authorization) {
    return response.status(403).send({message: 'Unauthorized'});
  }

  var token = request.headers.authorization.replace(/['"]+/g,''); //token de la cabacera
  try {
    var payload = jwt.decode(token, secret);
    if(payload.exp <= moment().unix()){
      return response.status(401).send({message: 'token expirado'});  
    }
  }catch(ex){
    return response.status(404).send({message: 'invalid token'});
  }

  request.user = payload;
  next(); // funcion para salir del middelware
};