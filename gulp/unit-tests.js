'use strict';

var path = require('path');
var gulp = require('gulp');
var nodeunit = require('gulp-nodeunit');
var conf = require('./conf');

var karma = require('karma');

var pathSrcHtml = [
  path.join(conf.paths.src, '/**/*.html')
];

var pathSrcJs = [
  path.join(conf.paths.build, '/serve/app/index.module.js')
];

function runTests (singleRun, done) {
  var reporters = ['progress'];
  var preprocessors = {};

  pathSrcHtml.forEach(function(path) {
    preprocessors[path] = ['ng-html2js'];
  });

  if (singleRun) {
    pathSrcJs.forEach(function(path) {
      preprocessors[path] = ['coverage'];
    });
    reporters.push('coverage');
  }

  var localConfig = {
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun,
    reporters: reporters,
    preprocessors: preprocessors
  };

  var server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error('Failed ' + failCount + ' tests.') : null);
  });
  server.start();
}

gulp.task('test', ['scripts:test', 'test:server'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['scripts:test-watch'], function(done) {
  runTests(false, done);
});

gulp.task('test:server', function() {
  gulp.src(path.join(conf.paths.serverTest, '/**/*.test.js'))
    .pipe(nodeunit({
      reporter: 'junit',
      reporterOptions: {
        output: conf.paths.testReports
      }
    }));  
});
