/**
 * Created by trieu on 5/27/15.
 */
// module.exports = {
//     url : 'mongodb://127.0.0.1:27017/adsplay'
// };

var mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb://127.0.0.1:27017/adsplay');