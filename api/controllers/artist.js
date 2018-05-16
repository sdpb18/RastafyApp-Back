'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(request, response) {
  var artistId = request.params.id;

  Artist.findById(artistId, (error, artist) => {
    if (error) {
      response.status(500).send({ message: 'error en la peticion.' });
    } else {
      if (!artist) {
        response.status(404).send({ message: 'el artista no existe.' });
      } else {
        response.status(200).send({ data: artist })
      }
    }
  })
}
function saveArtist(request, response) {
  var artist = new Artist();
  var params = request.body;
  console.log(request.body);
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';
  console.log(artist);
  artist.save((err, artistStored) => {
    if (err) {
      response.status(500).send({ message: 'error al guardar artista.' });
    } else {
      if (!artistStored) {
        response.status(404).send({ message: 'no ha sido guardado el artista.' });
      } else {
        response.status(200).send({ message: 'artista guardado.', data: artistStored });
      }
    }
  });
}
function getArtists(request, response) {
  var page = (request.params.page) ? request.params.page : 1;
  var itemsPerPage = 100;

  Artist.find().sort('name').paginate(page, itemsPerPage, (error, artists, total) => {
    if (error) {
      response.status(500).send({ message: 'error en la peticion.' });
    } else {
      if (!artists) {
        response.status(404).send({ message: 'no hay artistas' });
      } else {
        return response.status(200).send({
          total_items: total,
          data: artists
        });
      }
    }
  });
}
function updateArtist(request, response) {
  var artistId = request.params.id;
  var update = request.body;

  Artist.findByIdAndUpdate(artistId, update, (error, artistUpdated) => {
    if (error) {
      response.status(500).send({ message: 'error al actualizar artista.' });
    } else {
      if (!artistUpdated) {
        response.status(404).send({ message: 'no se ha actualizado el artista.' });
      } else {
        response.status(200).send({ message: 'artista actualizado.', data: artistUpdated });
      }
    }
  });
}

function deleteArtist(request, response) {
  var artistId = request.params.id;
  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      response.status(500).send({ message: 'Error al eliminar Artista' });
    } else {
      if (!artistRemoved) {
        response.status(404).send({ message: 'El artista no ha sido eliminado' });
      } else {
        Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
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
    }
  });
}

function uploadImg(request, response) {
  var artistId = request.params.id;
  var fileName = 'no subido...';

  if(request.files) {
    var filePath = request.files.image.path;
    var fileSplit = filePath.split('\/');
    var fileName = fileSplit[2];
    var ext_split = fileName.split('\.');
    var file_ext = ext_split[1];
    if( file_ext === 'png' || file_ext == 'jpg') {
      Artist.findByIdAndUpdate(artistId, {image: fileName}, (err, artistUpdated) => {
        if(!artistUpdated) {
          response.status(404).send({message: 'no se pudo actualizar el artista.'});
        } else {
          response.status(200).send({message: 'usuario actualizado.', data: artistUpdated});
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
  var PATH_FILE = './uploads/artists/'+imgFile;
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
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImg,
  getImgFile
}
