var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css'); 
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');

/**
 * File patterns
 **/

// Test project directory
var testProjectDirectory1 = '/home/ivan/NetBeansProjects/com.successful.bablo/www';
var testProjectDirectory2 = '/home/ivan/Dropbox/Arbeit/ionic-letter-avatar-selector/example/www';

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

// tests
var testDirectory = path.join(rootDirectory, './test/unit');

var sourceFiles = [
    // Make sure module files are handled first
    path.join(sourceDirectory, '/**/*.module.js'),
    // Then add all JavaScript files
    path.join(sourceDirectory, '/**/*.js')
];

var lintFiles = [
    'gulpfile.js',
    // Karma configuration
    'karma-*.conf.js'
].concat(sourceFiles);

gulp.task('build', function() {
    gulp.src(sourceFiles)
        .pipe(plumber())
        .pipe(concat('ionic-letter-avatar-selector.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('ionic-letter-avatar-selector.min.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest(testProjectDirectory1 + '/lib/own'))
        .pipe(gulp.dest(testProjectDirectory2 + '/lib/other'));
});

gulp.task('sass', function(done) {
    gulp.src('./style/scss/ionic-letter-avatar-selector.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./style/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./style/css/'))
        .on('end', done);
});

/**
 * Watch task
 */
gulp.task('watch', function() {

    // Watch JavaScript files
    gulp.watch(sourceFiles, ['process-all']);

    // watch test files and re-run unit tests when changed
    gulp.watch(path.join(testDirectory, '/**/*.js'), ['test-src']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function() {
    return gulp.src(lintFiles)
            .pipe(plumber())
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function(done) {
    karma.start({
        configFile: __dirname + '/karma-src.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function(done) {
    karma.start({
        configFile: __dirname + '/karma-dist-concatenated.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function(done) {
    karma.start({
        configFile: __dirname + '/karma-dist-minified.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', function(done) {
    runSequence('build', 'sass', 'test-src', done);
});
