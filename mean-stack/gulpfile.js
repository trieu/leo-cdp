var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

//$ gulp (compress source cotroller)
gulp.task('default', function() {
	gulp.src(['app/index.js', 'app/controllers/*.js', 'app/components/**/*.js'])
	.pipe(concat('angular-app.js'))
	.pipe(gulp.dest('public/js'))
});

//$ gulp (compress source cotroller and minimize)
gulp.task('minimize', function() {
	gulp.src(['app/index.js', 'app/controllers/*.js', 'app/components/**/*.js'])
	.pipe(concat('angular-app.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('public/js'))
});

//$ gulp angular (compress source plugin)
gulp.task('angular', function() {
	gulp.src('public/js/angular/*.js')
	.pipe(concat('angular-full.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('public/js'))
});

//$ gulp (watch file source cotroller and compress)
gulp.task('watch', function(){
	gulp.watch(['app/index.js', 'app/controllers/*.js', 'app/components/**/*.js'], ['default']);
});