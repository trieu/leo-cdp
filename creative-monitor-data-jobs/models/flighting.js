var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.local);
autoIncrement.initialize(connection);

var flighting_daily = new mongoose.Schema({
  id: { type: Number, index: true },
  booking: { type: Number , default: 0},
  begin: {type: Date},
  end: {type: Date}
});

flighting_daily.plugin(autoIncrement.plugin, {
    model: 'flighting_daily',
    field: 'id',
    startAt: 1000
});

module.exports = {
	flighting_daily: mongoose.model('flighting_daily', flighting_daily, 'flighting_daily')
}

