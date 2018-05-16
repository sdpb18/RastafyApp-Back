'use strict'
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs'); // modulo para encriptar contraseñas
var jwt = require('../services/jwt');

// importanciones para trabajar con el sistema de ficheros del sistema.
var fs = require('fs'); // filesystem.
var path = require('path') // path de los archivos.

function pruebas(request, response) {
  response.status(200).send({
    message: 'probando controllador de usuarios'
  });
}

function register(request, response) {
  var user = new User(); // instancia del modelo usuario

  var params = request.body; // se recoge los paramateros del body de la peticion.
  user.name = params.name;
  user.lastname = params.lastname;
  user.email = params.email;
  user.role = 'user_role';
  user.image = 'null';

  if(params.password){
    // encriptar contraseña y guarda datos.
    bcrypt.hash(params.password, null, null, function(error,hash){
      user.password = hash;
      if(user.name != null && user.lastname != null && user.email != null){
        //guarda el usuario
        user.save((err, userStored) => {
          if(err){
            response.status(500).send({message: 'Error al guardar el usuario'+ err});
          } else {
            if(!userStored) {
              response.status(404).send({message: 'no se guardo el usuario'});
            } else {
              response.status(200).send({message: 'se ha guardado', data: userStored});
            }
          }
        });
      }else{
        response.status(200).send({message: 'rellena todos los campos'});
      }
    });
  } else {
    response.status(500).send({message: 'Introduce la contraseña'});
  }
}
function login(request, response){
  var params = request.body;
  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) =>{
    if(err) {
      response.status(500).send({message: 'Error en la peticion'});
    } else {
      if(!user){
        response.status(404).send({message: 'El usuario no existe'});
      } else {
        // si existe se comprueba la contraseña
        bcrypt.compare(password, user.password, (error, check) => {
          if(check) {
            // devolver los datos del usuario logueado.
            if(params.gethash){
              // devolver un token de jwt.
              response.status(200).send({
                data: jwt.createToken(user)
              });

            } else {
              response.status(200).send({returnCode:'U0000',data: user});
            }
          } else {
            response.status(404).send({returnCode:'00000', message: 'usuario no ha podido loguearse'});
          }
        });
      }
    }
  });
}
function updateUser(request, response){
  var userId = request.params.id;
  var update = request.body; // se toman todos los datos de la peticion

  // comprobamos que el user id se igual al que esta guardado en el token;
  if(userId !== request.user.sub){
    return response.status(500).send({message: 'No tienes permiso para actualizar'});
  }

  User.findByIdAndUpdate(userId, update,(err, userUpdated) => {
    if(err){
      response.status(500).send({message: 'error al actualizar el usuario.'});
    } else {
      if(!userUpdated) {
        response.status(404).send({message: 'no se pudo actualizar el usuario.'});
      } else {
        response.status(200).send({message: 'usuario actualizado.', newUser: request.body, oldUser: userUpdated});
      }
    }
  });
}
function uploadImg(request, response) {
  var userId = request.params.id;
  var fileName = 'no subido...';

  if(request.files) {
    var filePath = request.files.image.path;
    var fileSplit = filePath.split('\/');
    var fileName = fileSplit[2];
    var ext_split = fileName.split('\.');
    var file_ext = ext_split[1];
    
    if( file_ext === 'png' || file_ext == 'jpg') {
      User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdated) => {
        if(!userUpdated) {
          response.status(404).send({message: 'no se pudo actualizar el usuario.'});
        } else {
          response.status(200).send({message: 'usuario actualizado.', data: userUpdated, image: fileName});
        }   
      });
    }
  }else {
    response.status(200).send({message: 'no has subido ninguna imagen'});
  }
}
function getImgFile(request, response) {
  var imgFile = request.params.imageFile;
  var PATH_FILE = './uploads/users/'+imgFile;
  fs.exists(PATH_FILE, (exist) => {
    if(exist){
      response.sendFile(path.resolve(PATH_FILE))
    }else {
      response.status(200).send({
        message: 'No existe la imagen'
      });
    }
  });
}


module.exports = {
  pruebas,
  register,
  login,
  updateUser,
  uploadImg,
  getImgFile
};