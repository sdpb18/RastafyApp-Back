'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
  title: String,
  description: String,
  year: Number,
  image: String,
  artist: { type: Schema.ObjectId, ref: 'artist'} // hace referencia a un documento de la bd de tipo artist
});

module.exports = mongoose.model('album', AlbumSchema);