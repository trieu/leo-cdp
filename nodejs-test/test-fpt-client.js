var JSFtp = require("jsftp");
var Fs = require("fs");

var ftp = new JSFtp({
  host: "",
  port: 21, 
  user: "", 
  pass: "" 
});

var testListFilesAndQuit = function(){
 	ftp.ls("/static/ads/instream/", function(err, res) {
  		res.forEach(function(file) {
    		console.log(file.name);	
    		quitFptConnection();
  		});
 	});
}

var quitFptConnection = function(){
	ftp.raw.quit(function(err, data) {
	    if (err) return console.error(err);
    	console.log("Bye!");
	});
}

var testUploadFile = function(){
  var mediaName = 'test-from-node.mp4';
  var localFile = '/home/trieu/Videos/167-sd.mp4';

 Fs.readFile(localFile, "binary", function(err, data) {
	var buffer = new Buffer(data, "binary");
	var filePath = '/static/ads/instream/' + mediaName;
	
	console.log("readFile OK " + localFile);

    ftp.put(buffer, filePath, function(hadError) {		
    	if(!hadError) {
    		console.log("Upload OK at remote file " + filePath);
    	}

       	ftp.ls(filePath, function(err, res) {
       		res.forEach(function(file) {
       			if(file.name.indexOf(mediaName)>0)
    				console.log("Upload Success !");
    				quitFptConnection();
    			});
          });
        });
    });    
}

testUploadFile();

