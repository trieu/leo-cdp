/**
 * Created by trieu on 6/29/16.
 */
var dbConfig = require('../configs/database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

//setup connect autoIncrement
var connection = mongoose.createConnection(dbConfig.url);
autoIncrement.initialize(connection);

var publisherSchema = new mongoose.Schema({
    _id: {type: Number, required: true, index: true},
    name: { type: String, default: '' },
    domain: { type: String, default: '' }
});

publisherSchema.plugin(autoIncrement.plugin, {
    model: 'publishers',
    field: '_id',
    startAt: 1000
});

module.exports =  mongoose.model('publishers', publisherSchema);
