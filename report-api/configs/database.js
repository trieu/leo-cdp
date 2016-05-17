/**
 * Created by trieu on 5/27/15.
 */
/*
module.exports = {
    url : 'mongodb://127.0.0.1:27017/adsplay'
};
*/
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test_report');

var pingSchema = mongoose.Schema({
	time: { type: Date, default: Date.now },
	fields: []
});
var pingModel = mongoose.model('pings', pingSchema);

//**add data once if empty 

// var data_test = require('../models/test.js');
// mongoose.connection.once('open', function() {
// 	pingModel.find({}, function (err, data) {
// 		if (err) return console.error(err);
// 		for(var k in data_test) {
//             var doc = new pingModel(data_test[k]);
//             doc.save(function(err) {
//                 if (err) return handleError(err);
//             });

//         }
// 	})
// });

//**end insert data


module.exports = {
	ping: pingModel
};