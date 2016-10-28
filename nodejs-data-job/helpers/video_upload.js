var crypto = require('crypto');
var fs = require('fs.extra');
var youtubedl = require('youtube-dl'); //package download video youtube
var ffmpeg = require('fluent-ffmpeg'); //package convert
var JSFtp = require("jsftp"); //package upload ftp
var site = require("../configs/site.js");
var video_utils = require("./video_utils.js");

var youtube = function (input, output, callback) {

    var video = youtubedl(input, ['--format=18'], { cwd: __dirname });

    // Will be called when the download starts. 
    video.on('info', function(info) {
        
        try{
            var filename = video_utils.removeUnicodeSpace(info._filename); //clean name
            console.log('___ Process download youtube ___');
            console.log('Download started size: ' + info.size);
            console.log('Filename: ' + filename);

            video_utils.newFolder(output);
            var outputFolder = output+'/'+filename;
            video.pipe(fs.createWriteStream(outputFolder));
            
            video.on('error', function error(err) {
                console.log('Error download youtube: ', err);
                callback(false);
            });

            video.on('end', function(){
                var obj = {mediaName: filename, path: output};
                callback(obj);
            });

        }

        catch (e) {
            console.error(e);
        }
    });

};


var localClient = function(input, output, callback){

    console.log('___ Process upload video ___');
    video_utils.newFolder(output);
    var outputFolder = output+'/'+input.name;

    fs.copy(input.path, outputFolder, function(err) {  
        if (err) {
            console.error(err);
            callback(false);
        } else {
            var obj = {mediaName: input.name, path: output};
            callback(obj);
        }

    });
}

var convert = function(input, output, option, callback){
    var seedStr = input + (new Date()).getTime();
    var hash = crypto.createHash('md5').update(seedStr).digest('hex');
    var mediaName = hash + '.mp4';
    var folderOutput = output + "/" + mediaName;

    var bitrate = {"240p": "426x240", "360p": "640x360", "480p": "854x480"};

    for(var i in bitrate){
        if (option.bitrate == i) {
            option.bitrate = bitrate[i];
        }
    };

    var command = ffmpeg(input);

    command.videoCodec(option.videoCodec)
    .audioCodec(option.audioCodec)
    .format(option.format);

    command.size(option.bitrate).save(folderOutput);

    command.on('start', function() {
        console.log('___ Process converting video ___');
        console.log('Video converting to ' + option.format);
    });

    command.on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        callback(false);
    });

    command.on('end', function() {
        console.log('finished !!!');
        callback({mediaName: mediaName, path: output});
    });

};


var ftp_video = function(localFile, mediaName, callback){

    var ftp_video = site.ftp_video;
    var ftp = new JSFtp({
        host: ftp_video.host,
        port: ftp_video.port, 
        user: ftp_video.user, 
        pass: ftp_video.pass
    });

    var quitFtpConnection = function(){
        ftp.raw.quit(function(err, data) {
            if (err) return console.error(err);
            console.log("upload CDN Success !");
        });
    };

    fs.readFile(localFile, "binary", function(err, data) {
        var buffer = new Buffer(data, "binary");

        var filePath = ftp_video.ftpBaseFolderPath+ mediaName;
        
        console.log('___ Process upload ftp ___');
        console.log("readFile OK " + localFile);

        ftp.put(buffer, filePath, function(hadError) {
            if (hadError){
                console.error('There was an error retrieving the file.');
                callback(false);
            }
            else{
                ftp.ls(filePath, function(err, res) {
                    res.forEach(function(file) {
                        if(file.name.indexOf(mediaName)>0){
                            console.log("Upload Success !");
                            callback({url: filePath, filename: mediaName});
                        }
                        quitFtpConnection();
                    });
                });
            }
        });

    });
};

// ______________________ exports ______________________ 
module.exports = {
    localClient: localClient,
    youtube: youtube,
    convert: convert,
    ftp_video: ftp_video
}