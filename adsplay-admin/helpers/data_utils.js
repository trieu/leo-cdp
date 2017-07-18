var request = require('request');

exports.request = function (url, callback) {
	var data = [];
	request(url ,function (err, response, body) {
		if(!err && response.statusCode == 200){
			data = JSON.parse(body);
			callback(null, data);
		}
		else{
			console.error(err);
			callback(null, null);
		}
	});
};

exports.request_send_data = function (url, data, res){
	//console.log(url, data)
	request.post({url: url, form: JSON.stringify(data)}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        	console.log(body)
            res.status(200).end(body);
        } else {
            console.error(error)
        }
    });
}