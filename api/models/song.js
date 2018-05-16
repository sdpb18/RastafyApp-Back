'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
  number: String,
  name: String,
  duration: String,
  file: String,
  album: { type: Schema.ObjectId, ref: 'album'} // hace referencia a un documento de la bd de tipo album
});

module.exports = mongoose.model('song', SongSchema);