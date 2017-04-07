var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
 
gulp.task('compress', function() {
  return gulp.src('./public/js/adsplay-display-ad.js')
    .pipe(concat('adsplay-display-ad.min.js'))
    .pipe(uglify({mangle: false}))
	.pipe(gulp.dest('public/js'));
});