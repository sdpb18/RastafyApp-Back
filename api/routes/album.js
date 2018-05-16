'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');

var api = express.Router(); // permite usar POST PUT GET etc.
var md_auth = require ('../middelwares/authenticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums'});

api.get('/getalbum/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/getalbums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/savealbum', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/updatealbum/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/deletealbum/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/uploadimagealbum/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImg);
api.get('/getimagealbum/:imageFile', AlbumController.getImgFile);
 

module.exports = api;