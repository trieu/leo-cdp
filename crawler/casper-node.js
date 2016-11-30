var spawn = require('child_process').spawn;

var bin = "casperjs"
//googlelinks.js is the example given at http://casperjs.org/#quickstart
var args = ['casper-script2.js'];
var cspr = spawn(bin, args);
  
cspr.stdout.setEncoding('utf8');
cspr.stdout.on('data', function(data) {
  var str = data.toString(), lines = str.split(/(\r?\n)/g);
  for (var i=0; i<lines.length; i++) {
    // Process the line, noting it might be incomplete.
    console.log("foo: " + lines[i]);
  }
});
cspr.stderr.on('data', function (data) {
    data += '';
    console.log(data.replace("\n", "\nstderr: "));
});

// cspr.on('exit', function (code) {
//     console.log('child process exited with code ' + code);
//     process.exit(code);
// });