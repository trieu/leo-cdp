var nodemon = require('nodemon');

//5 minute
var cycle = 5*60*1000;
setInterval(function(){
	nodemon({ script: 'app.js' }).on('restart', function () {
	  console.log('nodemon restart');
	}).on('crash', function () {
	  console.log('script crashed for some reason');
	});
}, cycle);