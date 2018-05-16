'use strict'

var express = require('express');
var bodyParser= require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabecera http en cada peticion
// middelware
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*'); //Permite el accesso a todo los dominios al API
  response.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Request-With, Content-Type, Accept,Access-Control-Allow-Request-Method');
  response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
})
//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
module.exports = app;