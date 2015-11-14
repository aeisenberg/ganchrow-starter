/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
var target = 'target';
exports.paths = {
  src: 'src',
  protractor: 'protractor',
  test: 'test',
  server: 'server/src',
  serverTest: 'server/test',
  target: target,
  dist: target + '/dist',
  build: target + '/build',
  testReports: target + '/test-reports',
  coverage: target + '/coverage',
  archives: target + '/archives'
};

/**
 *  Wiredep is the lib which injects bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/jquery/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
