/**
 * Created by trieu on 6/29/16.
 */
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var publisher = require('./publisher')
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.url);
autoIncrement.initialize(connection);

var placementSchema = new mongoose.Schema({
    _id: {type: Number, required: true, index: true},
    name: { type: String, default: '' },
    publisher  : {type : Number, ref : 'publishers'},
    enabled: {type: Boolean, default: true },
    type: { type: Number, default: 0 },
    impression: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    updatedDate : {type: Date, default: Date.now },
    adCode3rd: { type: String, default: '' },
    weight3rd: { type: Number, default: 0 },
    checkBaseDomain: {type: Boolean, default: false },
    baseDomain: { type: String, default: '' }
});

placementSchema.plugin(autoIncrement.plugin, {
    model: 'placements',
    field: '_id',
    startAt: 1000
});
module.exports =  mongoose.model('placements', placementSchema);
