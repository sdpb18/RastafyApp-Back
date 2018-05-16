'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var api = express.Router(); // permite usar POST PUT GET etc.
var md_auth = require ('../middelwares/authenticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists'});

api.get('/getartist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/getartists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/saveartist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/updateartist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/deleteartist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/uploadimageartist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImg);
api.get('/getimageartist/:imageFile', ArtistController.getImgFile);
 
module.exports = api;
