'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

/**
 * Load all js files in the gulp/ directory in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('default', ['clean', 'test', 'test:server'], function () {
  gulp.start('build', 'protractor');
});
