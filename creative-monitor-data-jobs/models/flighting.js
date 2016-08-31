var dbConfig = require('../configs/database');
var mongoose = require('mongoose');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.local);

var flighting_hourly = new mongoose.Schema({
  id: { type: Number, require: true, unique: true},
  booking: { type: Number , default: 0},
  begin: {type: Date},
  end: {type: Date}
});

module.exports = {
	flighting_hourly: mongoose.model('flighting_hourly', flighting_hourly, 'flighting_hourly')
}

