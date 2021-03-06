var gulp = require('gulp');
var path = require('path');
var packageInfo = require('./package.json');
var src = path.resolve(process.cwd(), 'lib');
var build = path.resolve(process.cwd(), 'build');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var exec = require('child_process').exec;
var rename = require('gulp-rename');

gulp.task('lint', function () {
  return gulp.src('./lib/**/*.js')
    .pipe(require('gulp-jsx')())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs());
});

gulp.task('less', function () {
  var less = require('gulp-less');
  return gulp.src('assets/*.less')
    .pipe(less())
    .pipe(gulp.dest('assets/'));
});

gulp.task('tag', function (done) {
  var cp = require('child_process');
  var version = packageInfo.version;
  cp.exec('git tag ' + version + ' | git push origin ' + version + ':' + version + ' | git push origin master:master', done);
});

gulp.task('gh-changelog', function (done) {
  var ghChangeLog = require('gh-changelog');
  ghChangeLog.getChangeLog({
    user: 'react-component',
    repo: 'calendar',
    mdFilePath: './HISTORY.md'
  }, function () {
    done();
  });
});

gulp.task('saucelabs', function (done) {
  require('saucelabs-runner')({
    browsers: [
      {browserName: 'chrome'},
      {browserName: 'firefox'},
      {browserName: 'internet explorer', version: 8},
      {browserName: 'internet explorer', version: 9},
      {browserName: 'internet explorer', version: 10},
      {browserName: 'internet explorer', version: 11, platform: 'Windows 8.1'}
    ]
  }).fin(function () {
    done();
    setTimeout(function () {
      process.exit(0);
    }, 1000);
  });
});
