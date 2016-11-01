/**
 * Created by trieu on 6/29/16.
 */
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.url);

var vastSchema = new mongoose.Schema({
	_id: {type: Number, required: true, index: true},
    Name: { type: String, default: '' },
    Impression: { type: [String] },
    TrackingEvents: { type: [] }, //{name: , value: }
	// VideoClicks: [{
	// 	ClickThrough : { type: String},
	// 	ClickTracking : { type: String}
	// }],
});

var Vast = mongoose.model('vast', vastSchema);

module.exports = Vast;