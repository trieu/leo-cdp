var kue = require('kue')
, jobs = kue.createQueue()
;
var Timer = require('../helpers/timer_utils');
var Video = require('../helpers/video_utils');


function VideoJob(timeout,userID){
  _this = this;
  //set default timeout
  var timer = new Timer(function() {}, timeout || 60000);

  //default option
  var optionDownload = {type: 'Download', title: 'Job Download Video'};
  var optionConvert = {type: 'Convert', title: 'Job Video Conversion'};
  var optionUpload = {type: 'Upload', title: 'Job Upload FTP'};


  //message
  _this.message = 'Nothing'
  _this.getError = function(){
    return _this.message;
  }
  _this.setError = function(err){
    _this.message = err;
  }
  //end message


  _this.setOptionDownload = function(option){
    optionDownload = option;
  }

  _this.setOptionConvert = function(option){
    optionConvert = option;
  }

  _this.setOptionUpload = function(option){
    optionUpload = option;
  }


  //new job form kue.js
  var newJob = function(name, option, done){
    option.userID = userID;
    var job = jobs.create(name, option);
    job
    .on('start', function(){
      console.log('\n \n > START Job ', job.id);
    })
    .on('complete', function (){
      console.log('___ Job ', job.id ,' completed with data ___');
      console.log(job.data);
      done();
    })
    .on('failed', function (err){
      console.log('___ Job ', job.id ,' failed with data ___');
      console.log(job.data);
      console.log(err)
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
      Video.youtube('https://www.youtube.com/watch?v=PqDQHCZF-Uo', videoFolder, timer.getTimeLeft()
      , function(temp){
        if(temp === false){
          _this.setError('Download Video Timeout');
          done(new Error('Download Video Timeout'));
        }
        else{
          temp_download = temp;
          return newJob("Video Conversion", optionConvert, done);
        }
      });

      console.log('Time left: '+ timer.getTimeLeft());
      ctx.pause( timer.getTimeLeft(), function(err){
        return done(err);
      })

    });



    //process video conversion
    var temp_convert = null;
    jobs.process('Video Conversion', function (job, ctx, done){

      if(temp_download !== null){
        //Config Video Conversion
        var input = temp_download.path+'/'+temp_download.mediaName;
        var option = {videoCodec: 'libx264', audioCodec: 'libmp3lame', format: 'mp4', bitrate: '360p'};

        //Video Conversion
        Video.convert(input, temp_download.path, option, timer.getTimeLeft()
        , function(temp){
          if(temp === false){
            _this.setError('Video Conversion Timeout');
            done(new Error('Video Conversion Timeout'));
          }
          else{
            temp_convert = temp;
            return newJob("Upload FTP", optionUpload, done);
          }
        });
        
      }

      console.log('Time left: '+ timer.getTimeLeft());
      ctx.pause( timer.getTimeLeft(), function(err){
        return done(err);
      });
    });

    //process Video Upload FTP
    jobs.process('Upload FTP', function (job, ctx, done){

      if(temp_convert !== null){
        //Video Conversion
        var input = temp_convert.path +'/'+ temp_convert.mediaName;
        Video.ftp_video(input, temp_convert.mediaName, function(temp){
          if(temp === false){
            _this.setError('Video Conversion Timeout');
            done(new Error('Video Conversion Timeout'));
          }
          else{
            console.log(temp)
            return done();
          }
        });
      }

      console.log('Time left: '+ timer.getTimeLeft());
      ctx.pause( timer.getTimeLeft(), function(err){
        return done(err);
      });
    });
  }

}

//set timeout & userID
var videoProcess = new VideoJob(60000, 1000);
//videoProcess.setOptionDownload({type: 'Download', title: 'dddddddddddd'});
videoProcess.init();


kue.app.listen( 3000 );
console.log( 'UI started on port 3000' );
