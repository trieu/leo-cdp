var fs = require('fs');
var Alexa = require('../models/alexa.js');
var spawn = require('child_process').spawn;
var casperSpawn = spawn("casperjs", ['casper-script.js']); //bin & arguments
  
casperSpawn.stdout.setEncoding('utf8');
casperSpawn.stdout.on('data', function(data) {
    console.log(data);
});

casperSpawn.stdout.on('end', function(data) {
    console.log('collection');

    var obj;
    fs.readFile('../json/alexa-info.json', 'utf8', function (err, data) {
        if (err) throw err;
        var json = JSON.parse(data);

        for (var i in json) {
          var item = new Alexa({web: i, doc: json[i]});
          console.log(item)
          item.save(function(err, obj){
            console.log(obj)
            if(err){
              return console.error(err);
            }
          });
        }
        
    });
});

casperSpawn.stderr.on('data', function (data) {
    data += '';
    console.log(data.replace("\n", "\nstderr: "));
});

// casperSpawn.on('exit', function (code) {
//     console.log('child process exited with code ' + code);
//     process.exit(code);
// });