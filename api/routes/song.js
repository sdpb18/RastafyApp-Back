'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router(); // permite usar POST PUT GET etc.
var md_auth = require ('../middelwares/authenticate');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs'});

api.get('/getsong/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/getsongs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/savesong',md_auth.ensureAuth, SongController.saveSong);
api.put('/updatesong/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/deletesong/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/uploadfilesong/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/getfilesong/:songFile', SongController.getSongFile);

module.exports = api;