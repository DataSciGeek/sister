var pkg = require('./package.json'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    mocha = require('gulp-mocha'),
    fs = require('fs'),
    del = require('del');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', ['lint'], function (cb) {
    del(['dist'], cb);
});

gulp.task('distribute', ['clean'], function () {
    return gulp
        .src('./src/sister.js')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('version', ['distribute'], function () {
    var bower = require('./bower.json');

    gulp
        .src('./dist/sister.js')
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/sister for the canonical source repository\n* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('sister.min.js'))
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/sister for the canonical source repository\n* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'));

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.version = pkg.version;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;

    fs.writeFile('./bower.json', JSON.stringify(bower, null, 4));
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
});

gulp.task('test', ['default'], function (cb) {
    gulp
        .src('./test/sister.js', {read: false})
        .pipe(mocha());
});

gulp.task('default', ['version']);