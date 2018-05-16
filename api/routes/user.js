'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router(); // carga router para crear rutas
var md_auth = require('../middelwares/authenticate'); // se carga el middelware

var multipart = require('connect-multiparty'); // middelware para trabajar con ficheros
var md_upload = multipart({ uploadDir: './uploads/users'}); // directorio donde se suben todas las imgs de usuario

api.get('/test-controller', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.register);
api.post('/login', UserController.login);
api.put('/updateuser/:id', md_auth.ensureAuth, UserController.updateUser); // put para actualizar recursos de la base de datos.
api.post('/uploadimageuser/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImg);
api.get('/getimageuser/:imageFile', UserController.getImgFile);

module.exports = api;