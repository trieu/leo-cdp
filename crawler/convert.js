var jsonfile = require('jsonfile');
var _ = require('underscore');
var file = './json/data2.json';
jsonfile.readFile(file, function(err, obj) {
	console.log(obj)
	var sort = _.sortBy(obj.result, function(o) { return parseInt(o.id); });
	var result = {};
	result.result = [];
	for(var i in sort){
		result.result.push({
			id: parseInt(sort[i].id),
			title: sort[i].title,
			name: sort[i].name,
			content: sort[i].content,
			image: sort[i].image
		})
	}
	jsonfile.writeFile('./json/final2.json', result, {spaces: 2}, function(err) {
		console.error(err)
	})
})