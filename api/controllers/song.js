'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(request, response) {
  var songId = request.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song)=> {
    if (err) {
      response.status(500).send({ message: 'error al buscar la cancion.' });
    } else {
      if (!song) {
        response.status(404).send({ message: 'no existe la cancion.' });
      } else {
        response.status(200).send({ message: 'cancion encontrada.', data:song});
      }
    }
  });
}

function saveSong(request, response) {
  var song = new Song();
  var params = request.body;

  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, songStored)=> {
    if (err) {
      response.status(500).send({ message: 'error al guardar cancion.' });
    } else {
      if (!songStored) {
        response.status(404).send({ message: 'no ha sido guardado la cancion.' });
      } else {
        response.status(200).send({ message: 'cancion guardada.', data: songStored });
      }
    }
  });
}

function getSongs(request, response) {
  var albumId = request.params.id;
  var find = (!albumId) ? Song.find({}).sort('number') : Song.find({album: albumId}).sort('number');
  find.populate ({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'artist'
    }
  }).exec((err, songs) => {
    if (err) {
      console.log('err',err);
      response.status(500).send({ message: 'error al buscar canciones.' });
    } else {
      if (!songs) {
        response.status(404).send({ message: 'no hay canciones.' });
      } else {
        response.status(200).send({songs});
      }
    }
  });
}

function updateSong(request, response) {
    var songId = request.params.id;
    var update = request.body;

    Song.findByIdAndUpdate(songId,update,(err, songUpdated)=>{
      if (err) {
        response.status(500).send({ message: 'error al actualizar la cancion.' });
      } else {
        if (!songUpdated) {
          response.status(404).send({ message: 'no se encontro la cancion.' });
        } else {
          response.status(200).send({data: songUpdated});
        }
      }
    });
}

function deleteSong( request, response) {
  var songId = request.params.id;

  Song.findByIdAndRemove(songId, (err, songRemoved)=> {
    if (err) {
      response.status(500).send({ message: 'error al eliminar la cancion.' });
    } else {
      if (!songRemoved) {
        response.status(404).send({ message: 'no se encontro la cancion.' });
      } else {
        response.status(200).send({data: songRemoved});
      }
    }
  })
}

function uploadFile(request, response) {
  var songId = request.params.id;
  var fileName = 'no subido...';

  if(request.files) {
    var filePath = request.files.file.path;
    var fileSplit = filePath.split('\/');
    var fileName = fileSplit[2];
    var ext_split = fileName.split('\.');
    var file_ext = ext_split[1];
    if( file_ext === 'mp3' || file_ext == 'ogg') {
      Song.findByIdAndUpdate(songId, {file: fileName}, (err, songUpdated) => {
        if(!songUpdated) {
          response.status(404).send({message: 'no se pudo actualizar la cancion.'});
        } else {
          response.status(200).send({message: 'cancion actualizada.', song: songUpdated});
        }   
      });
    } else {
      response.status(200).send({message:'extension del archivo no valida'});
    }
  }else {
    response.status(200).send({message: 'no has subido fichero de audio'});
  }
}
function getSongFile(request, response) {
  var songFile = request.params.songFile;
  var PATH_FILE = './uploads/songs/'+songFile;
  fs.exists(PATH_FILE, (exist) => {
    if(exist){
      response.sendFile(path.resolve(PATH_FILE))
    }else {
      response.status(200).send({
        message: 'No existe el fichero de audio'
      });
    }
  });
}

module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile
}