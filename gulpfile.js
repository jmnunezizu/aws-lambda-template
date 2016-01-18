var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var rename = require('gulp-rename');
var install = require('gulp-install');
var zip = require('gulp-zip');
var AWS = require('aws-sdk');
var fs = require('fs');
var runSequence = require('run-sequence');

var BUILD_DIR = './build';
var DIST_DIR = './dist';

gulp.task('clean', function (done) {
  del([BUILD_DIR, DIST_DIR]).then(function (paths) {
    if (paths.length === 0) {
      gutil.log('Nothing to clean here. Moving on.')
    } else {
      gutil.log('Successfully deleted:\n' + paths.join('\n'));
    }
    done();
  });
});

gulp.task('js', function () {
  return gulp.src('index.js')
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('npm', function () {
  return gulp.src('./package.json')
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(install({production: true}));
});

gulp.task('zip', function () {
  gulp.src(['build/**/*', '!build/package.json', 'build/.*'])
    .pipe(zip('aws-lambda-template.zip'))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('default', function (done) {
  return runSequence(
    'clean',
    ['js', 'npm'],
    'zip',
    done
  );
});
