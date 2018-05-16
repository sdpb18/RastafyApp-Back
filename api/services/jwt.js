'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_proyecto_bdd'

exports.createToken = function (user) {
  var payload = {
    sub: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(), // formato timestamp actual
    exp: moment().add(1, 'days').unix
  };

  return jwt.encode(payload, secret);
};