'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(request, response) {
  var albumId = request.params.id;

  // path propiedad donde se carga los datos del objeto asociado al ID guardado.
  Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
    if (err) {
      response.status(500).send({ message: 'error en la peticion.' });
    } else {
      if (!album) {
        response.status(404).send({ message: 'album no existe' });
      } else {
        response.status(200).send({ message: 'album encontado', data: album });
      }
    }
  });
}
function getAlbums(request, response) {
  var artistId = request.params.artist;
  var find = (!artistId) ? Album.find({}).sort('title') : Album.find({ artist: artistId }).sort('year');

  find.populate({ path: 'artist' }).exec((err, albums) => {
    if (err) {
      response.status(500).send({ message: 'error en la peticion' });
    } else {
      if (!albums) {
        response.status(404).send({ message: 'no se encontrado ningun album.' });
      } else {
        response.status(200).send({ data:albums });
      }
    }
  });
}
function deleteAlbum(request, response) {
  var albumId = request.params.id;

  Album.findByIdAndRemove(albumId,(err, albumRemoved) => {
    if (err) {
      response.status(500).send({ message: 'Error al eliminar album' });
    } else {
      if (!albumRemoved) {
        response.status(404).send({ message: 'El album no ha sido eliminado' });
      } else {
        Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
          if (err) {
            response.status(500).send({ message: 'Error al eliminar album' });
          } else {
            if (!songRemoved) {
              response.status(404).send({ message: 'El album no ha sido eliminado' });
            } else {
              response.status(200).send({ message: 'artista y dependencias eliminada' });
            }
          }
        });
      }
    }
  });
}
function updateAlbum(request, response) {
  var albumId = request.params.id;
  var update = request.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      response.status(500).send({ message: 'error en la peticion' });
    } else {
      if (!albumUpdated) {
        response.status(404).send({ message: 'no se ha actualizado ningun album.' });
      } else {
        response.status(200).send({ data: albumUpdated });
      }
    }
  });
}
function saveAlbum(request, response) {
  var album = new Album();
  var params = request.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      response.status(500).send({ message: 'error en la peticion' });
    } else {
      if (!albumStored) {
        response.status(404).send({ message: 'no se ha guardado' });
      } else {
        response.status(200).send({ data: albumStored });
      }
    }
  });
}
function uploadImg(request, response) {
  var albumId = request.params.id;
  var fileName = 'no subido...';

  if(request.files) {
    var filePath = request.files.image.path;
    var fileSplit = filePath.split('\/');
    var fileName = fileSplit[2];
    var ext_split = fileName.split('\.');
    var file_ext = ext_split[1];
    if( file_ext === 'png' || file_ext == 'jpg') {
      Album.findByIdAndUpdate(albumId, {image: fileName}, (err, albumUpdated) => {
        if(!albumUpdated) {
          response.status(404).send({message: 'no se pudo actualizar el album.'});
        } else {
          response.status(200).send({message: 'album actualizado.', album: albumUpdated});
        }   
      });
    } else {
      response.status(403).send({message: 'formato no valido.'});
    }
  }else {
    response.status(200).send({message: 'no has subido ninguna imagen'});
  }
}
function getImgFile(request, response) {
  var imgFile = request.params.imageFile;
  var PATH_FILE = './uploads/albums/'+imgFile;
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
  saveAlbum,
  getAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImg,
  getImgFile
}