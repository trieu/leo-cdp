var gulp = require('gulp');
var concat = require('gulp-concat');
//var react = require('gulp-react');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel'); // Used to convert ES6 & JSX to ES5
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files

// gulp.task('react', function () {
//   return gulp.src(['app/*.{js,jsx}', 'app/**/*.{js,jsx}'])
//         .pipe(react())
//         .pipe(concat('react-bundle.js'))
//         .pipe(gulp.dest('public'));
// });

//******** begin react plugin
gulp.task('react-all', function () {
  return gulp.src(['public/js/react/react.min.js','public/js/react/react-dom.min.js','!public/js/react/react-all.js'])
        .pipe(uglify({mangle: false}))
        .pipe(concat('react-all.js'))
        .pipe(gulp.dest('public/js/react'));
});
// gulp.task('react-sourcemaps', ['react-all'], function () {
//   return gulp.src(['public/js/react/react-all.js'])
//         .pipe(sourcemaps.init())
//         .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: './public/js/react'}))
//         .pipe(gulp.dest('public'));
// });
//******** end

//transform react
gulp.task('bundle', function () {
  return gulp.src(['app/*.{js,jsx}', 'app/**/*.{js,jsx}'])
        .pipe(babel({
            presets: ["react","es2015"] //used presets react & es2015
        }))
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('public/js'));
});