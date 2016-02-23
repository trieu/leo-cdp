/**
 * Created by trieu on 2/20/16.
 */

var mongoose = require('mongoose');

var AnalyticStats = new mongoose.Schema({
    totalView: { type: Number, default: 0 },
    totalLike: { type: Number, default: 0 },
    totalFbScore: { type: Number, default: 0 },
    totalYtScore: { type: Number, default: 0 },
    updatedDate : {type: Date, default: Date.now }
});

module.exports = mongoose.model('playable_content', {
    id: String,
    playUrl: { type: String, required: true, index: {unique: true, dropDups: true} },
    source: { type: Number, default: 0 },
    playId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true},
    thumbnail: { type: String, required: true },
    tags: [String],
    author: {type: String, required: true, default: 'admin'},
    creationDate : { type: Date, default: Date.now, required: true },
    socialScore : { type: Number, default: 0 },
    analyticStats : [AnalyticStats]
});