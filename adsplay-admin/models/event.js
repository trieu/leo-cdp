var moment = require('moment');
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.url);
autoIncrement.initialize(connection);

var eventSchema = new mongoose.Schema({
	id: { type: Number, index: true },
	name: { type: String },
	view: { type: Number , default: 0},
	begin: {type: Date},
	end: {type: Date},
	status: {type: Number},
	hourly: [
		{
			time: { type: Date },
		 	view: { type: Number , default: 0}
		}
	]
});

eventSchema.plugin(autoIncrement.plugin, {
    model: 'event',
    field: 'id',
    startAt: 1000
});

module.exports = mongoose.model('event', eventSchema);

