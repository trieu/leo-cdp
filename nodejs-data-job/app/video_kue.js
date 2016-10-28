var kue = require('kue')
, jobs = kue.createQueue()
;
var Timer = require('../helpers/timer_utils');
var Video = require('../helpers/video_upload');
var video_utils = require("../helpers/video_utils.js");


function VideoJob(timeout,userID,path){
  _this = this;
  //set default timeout
  var timer = new Timer(function() {}, timeout || 60000);

  var optionDownload = {type: 'Download', title: 'Job Download Video with path: ' + path};
  var optionConvert = {type: 'Convert', title: 'Job Video Conversion'};
  var optionUpload = {type: 'Upload', title: 'Job Upload FTP'};

  //message
  _this.message = 'Nothing';
  _this.getError = function(){
    return _this.message;
  }
  _this.setError = function(err){
    _this.message = err;
  }

  //new job form kue.js
  var newJob = function(name, option, done){
    option.userID = userID;
    var job = jobs.create(name, option);
    job
    .on('start', function(){
      console.log('\n\n(*) START Job ', job.id, ' with data: ', JSON.stringify(job.data));
    })
    .on('complete', function (){
      console.log('\n--> Job', job.id ,' completed');
      done();
    })
    .on('failed', function (err){
      console.log('\n--> Job', job.id ,' failed !', _this.getError());
      done();
    })
    job.save();
  }


  _this.init = function(){
    //start process download
    newJob('Download Video', optionDownload, function(){
      console.log('\n \n End Job Video');
    });



    //process download
    var temp_download = null;
    jobs.process('Download Video', function (job, ctx, done){
      //Config Download Video
      var nameFolder = new Date().getTime();
      var videoFolder = __publicPath+"ads/video/"+nameFolder;

      //Download Video
      if (video_utils.youtubeValid(path)) {
        Video.youtube(path, videoFolder
        , function(temp){
          if(temp === false){
            var err = 'Download Video Youtube Timeout!';
            _this.setError(err);
            done(new Error(err));
          }
          else{
            temp_download = temp;
            console.log('Time left: '+ timer.getTimeLeft()+'ms');
            if (timer.getTimeLeft() > 0) {
              return newJob("Video Conversion", optionConvert, done);
            }
            else{
              var err = 'Download Video Youtube Timeout!';
              _this.setError(err);
              video_utils.deleteFolderRecursive(temp_download.path);
              done(new Error(err));
            }
          }
        });
      }
      else{
        var nameVideo = video_utils.getNamePath(path);
        var input = {path: path, name: nameVideo};
        Video.localClient(input, videoFolder
        , function(temp){
          if(temp === false){
            var err = 'Download Video Timeout!';
            _this.setError(err);
            done(new Error(err));
          }
          else{
            temp_download = temp;
            console.log('Time left: '+ timer.getTimeLeft()+'ms');
            if (timer.getTimeLeft() > 0) {
              return newJob("Video Conversion", optionConvert, done);
            }
            else{
              var err = 'Download Video Timeout!';
              _this.setError(err);
              video_utils.deleteFolderRecursive(temp_download.path);
              done(new Error(err));
            }
          }
        });
      }


    });



    //process video conversion
    var temp_convert = null;
    jobs.process('Video Conversion', function (job, ctx, done){

      if(temp_download !== null){
        //Config Video Conversion
        var input = temp_download.path+'/'+temp_download.mediaName;
        var option = {videoCodec: 'libx264', audioCodec: 'libmp3lame', format: 'mp4', bitrate: '360p'};

        //Video Conversion
        Video.convert(input, temp_download.path, option
        , function(temp){
          if(temp === false){
            var err = 'Video Conversion Timeout!';
            _this.setError(err);
            done(new Error(err));
          }
          else{
            temp_convert = temp;

            console.log('Time left: '+ timer.getTimeLeft()+'ms');
            if (timer.getTimeLeft() > 0) {
              return newJob("Upload FTP", optionUpload, done);
            }
            else{
              var err = 'Video Conversion Timeout!';
              _this.setError(err);
              video_utils.deleteFolderRecursive(temp_convert.path);
              done(new Error(err));
            }
          }
        });
        
      }

    });

    //process Video Upload FTP
    jobs.process('Upload FTP', function (job, ctx, done){

      // if(temp_convert !== null){
      //   //Video Conversion
      //   var input = temp_convert.path +'/'+ temp_convert.mediaName;
      //   Video.ftp_video(input, temp_convert.mediaName, function(temp){
      //     if(temp === false){
      //       _this.setError('Video Conversion Timeout');
      //       done(new Error('Video Conversion Timeout'));
      //     }
      //     else{
      //       console.log(temp)
      //       return done();
      //     }
      //   });
      // }
      done();
      video_utils.deleteFolderRecursive(temp_convert.path);

    });
  }

}

//set timeout & userID
var pathVideo = 'https://www.youtube.com/watch?v=PqDQHCZF-Uo'; //demo upload youtube
//var pathVideo = __publicPath+'ads/video/demo.mp4'; //demo upload local
var videoProcess = new VideoJob(60000, 1000, pathVideo); //timeout, userID, pathVideo
videoProcess.init();


kue.app.listen( 3000 );
console.log( 'UI started on port 3000' );
