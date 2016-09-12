var fs = require('fs.extra');
var JSFtp = require("jsftp");
var site = require("../configs/site.js");

var stringUtils = require('./string_utils');
//const ftpBaseFolderPath = '/static/videos/';
const ftpBaseFolderPath = '/static/ads/instream/';

var Upload = function () {};

var storage = function(output){
    var d = new Date();
    var dir = __dirname + '/../public/ads/' + output + '/' + d.getTime() + '/';
    //create folder
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir); 
    }
    return dir;
};

Upload.prototype.rename = function(str){
    remove_unicode_space(str);
};

Upload.prototype.folder = function(output){
    storage(output);
};


Upload.prototype.youtube = function (link, callback) {

    var youtubedl = require('youtube-dl');
    
    //request input link and input path
    var dir = storage('video');
    var output = dir + 'demo.mp4'; //default output

    var video = youtubedl(link, ['--format=18'], { cwd: __dirname });

    // Will be called when the download starts. 
    video.on('info', function(info) {
        
        console.log('Download started size: ' + info.size);
        console.log('Filename: ' + info._filename);

        var filename = stringUtils.removeUnicodeSpace(info._filename); //loại bỏ có dấu và khoảng trắng
        output = dir + filename; //cấu hình lại output
        
        video.pipe(fs.createWriteStream(output));
        
        video.on('end', function(){
            var obj = {filename: info._filename, url: output, size: info.size};
            callback(obj);
        });
    });

};


Upload.prototype.video = function(file, callback){

    var dir = storage('video');
    var output = dir + file.name;

    fs.copy(file.path, output, function(err) {  
        if (err) {
            console.error(err);
        } else {
            var obj = {url: output, folder: dir, filename: file.name};
            callback(obj);
        }
    });
}


Upload.prototype.ftp_video = function(localFile, mediaName, callback){

    var ftp_video = site.ftp_video;
    var ftp = new JSFtp({
        host: ftp_video.host,
        port: ftp_video.port, 
        user: ftp_video.user, 
        pass: ftp_video.pass
    });

    var quitFptConnection = function(){
        ftp.raw.quit(function(err, data) {
            if (err) return console.error(err);
            console.log("Bye!");
        });
    };

    fs.readFile(localFile, "binary", function(err, data) {
        var buffer = new Buffer(data, "binary");

        var filePath = ftpBaseFolderPath+ mediaName;
        
        console.log("readFile OK " + localFile);

        ftp.put(buffer, filePath, function(hadError) {
            if (hadError){
                    console.error('There was an error retrieving the file.');
            }
            else{
                ftp.ls(filePath, function(err, res) {
                    res.forEach(function(file) {
                        if(file.name.indexOf(mediaName)>0){
                            console.log("Upload Success !");
                            callback({url: filePath, filename: mediaName});
                        }
                        quitFptConnection();
                    });
                });
            }
        });
    });
};

Upload.prototype.image = function(file, callback){

    var dir = storage('overlay');
    var dirSplit = dir.split("/"); 
    var output = dir + file.name;
    var url = output.split("public/");

    fs.copy(file.path, output, function(err) {  
        if (err) {
            console.error(err);
        } else {
            var obj = {url: url[1], folder: dirSplit[dirSplit.length - 1], filename: file.name};
            callback(obj);
        }
    });
}

Upload.prototype.unzip = function(file, callback){

    var dir = storage('display');
    var dirSplit = dir.split("/"); 
    var output = dir + 'index.html';
    var url = output.split("public/");

    var extract = require('extract-zip');
    extract(file.path, {dir: dir}, function (err) {
        var obj = {url : '/display-banner/'+url[1], folder: dirSplit[dirSplit.length - 1]};
        callback(obj);
    });

}

module.exports = new Upload();