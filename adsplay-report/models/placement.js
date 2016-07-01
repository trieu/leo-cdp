/**
 * Created by trieu on 6/29/16.
 */

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection('mongodb://127.0.0.1:27017/adsplay');
autoIncrement.initialize(connection);

var placementSchema = new mongoose.Schema({
    id: { type: Number, required: true, index: true },
    name: { type: String, default: '' },
    publisher: { type: String, default: '' },
    type: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    updatedDate : {type: Date, default: Date.now }
});

placementSchema.plugin(autoIncrement.plugin, {
    model: 'placements',
    field: 'id',
    startAt: 1000
});

module.exports =  mongoose.model('placements', placementSchema);