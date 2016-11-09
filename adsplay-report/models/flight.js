var moment = require('moment');
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');

var connection = mongoose.createConnection(dbConfig.url);

var flightSchema = new mongoose.Schema({
	_id: { type: Number, index: true },
	name: { type: String },
	schedules: [
		{
			begin: { type: Date, default: Date.now},
			end: { type: Date},
			booking: { type: Number , default: 0}
		}
	]
});

module.exports = mongoose.model('flight', flightSchema);

