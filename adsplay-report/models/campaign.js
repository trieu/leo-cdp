var moment = require('moment');
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.url);
autoIncrement.initialize(connection);

var campaignSchema = new mongoose.Schema({
	_id: { type: Number, index: true },
	name: { type: String },
	ads: []
});

campaignSchema.plugin(autoIncrement.plugin, {
    model: 'campaign',
    field: '_id',
    startAt: 1000
});

module.exports = mongoose.model('campaign', campaignSchema);

