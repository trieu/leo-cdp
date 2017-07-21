var ffmpeg = require('fluent-ffmpeg');

exports.command = function(input, output, option, callback){

    //option = {videoCodec: 'libx264', audioCodec: 'libmp3lame', format: 'mp4', bitrate: '360p'}

    var bitrate = {"240p": "426x240", "360p": "640x360", "480p": "854x480", "720p":"1280x720"};

    for(var i in bitrate){
        if (option.bitrate == i) {
            option.bitrate = bitrate[i];
        }
    };

    var command = ffmpeg(input);

    command.videoCodec(option.videoCodec)
    .audioCodec(option.audioCodec)
    .format(option.format);

    command.size(option.bitrate).save(output);

    command.on('start', function() {
        console.log('Video converting to ' + option.format);
    });

    command.on('error', function(err) {
        console.log('An error occurred: ' + err.message);
    })

    command.on('end', function() {
        console.log('finished !!!');
        callback();
    });
};