var crypto = require('crypto');
var fs = require('fs.extra');
var youtubedl = require('youtube-dl'); //package download video youtube
var ffmpeg = require('fluent-ffmpeg'); //package convert
var JSFtp = require("jsftp"); //package upload ftp
var site = require("../configs/site.js");

var youtube = function (input, output, timeout, callback) {

    var video = youtubedl(input, ['--format=18'], { cwd: __dirname });

    // Will be called when the download starts. 
    video.on('info', function(info) {
        
        try{
            var filename = removeUnicodeSpace(info._filename); //clean name
            console.log('___ Process download youtube ___');
            console.log('Download started size: ' + info.size);
            console.log('Filename: ' + filename);

            newFolder(output);
            var outputFolder = output+'/'+filename;
            video.pipe(fs.createWriteStream(outputFolder));
            
            video.on('end', function(){
                var obj = {mediaName: filename, path: output};
                callback(obj);
            });

            setTimeout(function(){
              return callback(false);
            }, timeout);

        }

        catch (e) {
            console.error(e);
        }
    });

};


var video = function(input, output, callback){

    console.log('___ Process upload video ___');

    fs.copy(input.path, output, function(err) {  
        if (err) {
            console.error(err);
            callback(false);
        } else {
            var obj = {mediaName: input.name, path: output};
            callback(obj);
        }

    });
}

var convert = function(input, output, option, timeout, callback){
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

    setTimeout(function(){
      command.kill();
      return callback(false);
    }, timeout);

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


// ______________________ helper ______________________ 
var removeUnicodeSpace = function (str){
    var s = str;
    s= s.toLowerCase();
    s= s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    s= s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    s= s.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    s= s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    s= s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    s= s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    s= s.replace(/đ/g,"d");

    s= s.replace(/\s+/gi,"-");
    s= s.replace(/^\-+|\-+$/g,"");
    return s;
};

var newFolder = function(name){
    //create folder
    if (!fs.existsSync(name)){
        fs.mkdirSync(name); 
    }
};

// ______________________ exports ______________________ 
module.exports = {
    video: video,
    youtube: youtube,
    convert: convert,
    ftp_video: ftp_video
}