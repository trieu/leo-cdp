/**
 * Created by trieu on 6/29/16.
 */

var mongoose = require('mongoose');



module.exports = mongoose.model('placements', {
    id: { type: Number, default: 0 },
    name: { type: String, default: '' },
    publisher: { type: String, default: '' },
    type: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    updatedDate : {type: Date, default: Date.now }
});