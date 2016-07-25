var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');

gulp.task('js-min', function() {
	return gulp.src(['public/js/*.js','!public/js/jquery.js','!public/js/moment.min.js','!public/js/js-min.js'])
			.pipe(concat('js-min.js'))
			.pipe(uglify({mangle: false}))
			.pipe(gulp.dest('public/js'))
});

gulp.task('css-min', function() {
	return gulp.src(['public/css/*.css','!public/js/css-min.css'])
			.pipe(concat('css-min.css'))
			.pipe(cleanCss())
			.pipe(gulp.dest('public/css'));
});

gulp.task('default', ['js-min', 'css-min']);

//$ gulp (watch file)
gulp.task('watch', function(){
	gulp.watch(['public/css/*.css', 'public/js/*.js','!public/js/css-min.css','!public/js/js-min.js'], ['default']);
});