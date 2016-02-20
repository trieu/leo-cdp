/**
 * Created by trieu on 2/20/16.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('playable_content', {
    id: String,
    source: { type: Number, default: 0 },
    playUrl: { type: String, required: true, index: {unique: true, dropDups: true} },
    title: { type: String, required: true },
    description: { type: String, required: true},
    thumbnail: { type: String, required: true },
    tags: [String],
    author: {type: String, required: true, default: 'admin'},
    creationDate : { type: Date, default: Date.now, required: true }
});