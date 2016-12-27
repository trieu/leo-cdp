var config = require('../config.js');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var autoIncrement = require('mongoose-auto-increment');
//setup connect autoIncrement
var connection = mongoose.createConnection(config.database);
autoIncrement.initialize(connection);

var alexaSchema = new mongoose.Schema({
	_id: { type: Number, index: true },
	web: { type: String },
	doc: []
});

alexaSchema.plugin(autoIncrement.plugin, {
	model: 'alexa',
	field: '_id',
	startAt: 1
});

module.exports = mongoose.model('alexa', alexaSchema);