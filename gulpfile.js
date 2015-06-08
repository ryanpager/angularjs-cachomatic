/**
 * Script to handle all of the generic build tasks for the cachomatic package
 *  such as linting, coffeescript conversion, etc.
 *
 * @author    Ryan Page <ryanpager@gmail.com>
 * @see       https://github.com/ryanpager/cachomatic
 * @version   1.0.0
 */

// BUILD Dependencies
// ------------------------------------------------------------------

var gulp       = require('gulp');
var plumber    = require('gulp-plumber');
var coffee     = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var clean      = require('gulp-clean');
var rename     = require('gulp-rename');
var header     = require('gulp-header');
var pkg        = require('./package.json');

// BUILD Banner
// ------------------------------------------------------------------
var banner = [
  '/**',
  ' * <%= pkg.description %>',
  ' * @author <%= pkg.name %> <<%= pkg.email %>>',
  ' * @version v<%= pkg.version %>',
  ' * @see <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

// Tasks
// ------------------------------------------------------------------

gulp.task('clean', function() {
   gulp.src(['./release/**/*.js'], {read: false})
       .pipe(clean({force: true}));
});

gulp.task('lint', function() {
   gulp.src('./src/**/*.coffee')
       .pipe(coffeelint())
       .pipe(coffeelint.reporter());
});

gulp.task('build-standalone', function() {
   gulp.src(['./src/**/*.coffee'])
       .pipe(plumber({
         errorHandler: function (error) {
           console.log(error.message);
           this.emit('end');
         }
       }))
       .pipe(coffee({
         bare: true
       }))
       .pipe(header(banner, { pkg : pkg }))
       .pipe(concat('cachomatic.standalone.js'))
       .pipe(gulp.dest('./release'));
});

gulp.task('build-package', function() {
   gulp.src([
         './vendor/moment/moment.js',
         './release/cachomatic.standalone.js'
       ])
       .pipe(concat('cachomatic.js'))
       .pipe(gulp.dest('./release'));
});

gulp.task('uglify-standalone', function() {
   gulp.src('./release/cachomatic.standalone.js')
       .pipe(uglify())
       .pipe(header(banner, { pkg : pkg }))
       .pipe(rename("cachomatic.standalone.min.js"))
       .pipe(gulp.dest('./release'));
});

gulp.task('uglify-package', function() {
   gulp.src('./release/cachomatic.js')
       .pipe(uglify())
       .pipe(rename("cachomatic.min.js"))
       .pipe(gulp.dest('./release'));
});

// BUILD Task
// ------------------------------------------------------------------

gulp.task('build', [
  'clean',
  'lint',
  'build-standalone',
  'build-package',
  'uglify-standalone',
  'uglify-package'
]);

// WATCH Task
// ------------------------------------------------------------------

gulp.task('watch', function() {
  // Watch and build the coffee script & sass files
  gulp.watch('./src', ['build']);
});
