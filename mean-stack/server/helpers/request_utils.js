var request = require('request');

exports.get = function (url, callback) {
	var data = [];
	request(url ,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
        }
        callback(data);
    });
};