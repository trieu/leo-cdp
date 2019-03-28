
var localCompilerPath = '/home/platform/Programs/closure-compiler-v20180910.jar';
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');

var srcList = [
  './src/tracking.src.js',
  './src/video.src.js',
  './src/vast-player.js',
  './src/videojs.youtube.src.js',
  './src/videojs.facebook.src.js',
  './src/videojs.vimeo.src.js',
  './src/videojs.watermark.src.js',
  './src/videojs.ga.src.js', 
  './src/viewability.src.js',
  './src/vmap.src.js',
  './src/mediaplayer.src.js'
];

gulp.task('default', function () {
  return gulp.src(srcList)
    .pipe(closureCompiler({
      compilerPath: localCompilerPath,
      fileName: './build/mediaplayer.one.min.js'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('blueseed', function () {
  return gulp.src(srcList)
    .pipe(closureCompiler({
      compilerPath: localCompilerPath,
      fileName: './build/mediaplayer.one.min.js'
    }))
    .pipe(gulp.dest('build'));
});


var srcListForPose = [
  './src/tracking.src.js',
  './src/video.src.js',
  './src/vast-player.js',  
  './src/videojs.ga.src.js', 
  './src/viewability.src.js',
  './src/vmap.src.js',
  './src/mediaplayer.src.js',
  './js/posevideoplayer.js'
];
gulp.task('poseplayer', function () {  
  return gulp.src(srcListForPose)
    .pipe(closureCompiler({
      compilerPath: localCompilerPath,
      fileName: './build/posevideoplayer.min.js'
    }))
    .pipe(gulp.dest('build'));
});