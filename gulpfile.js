'use strict';

var gulp       = require('gulp'),
	stylish    = require('jshint-stylish'),
	path       = require('path'),
	fs         = require('fs'),
	chalk      = require('chalk'),


	gulpPlugins = require('gulp-load-plugins')();

// chalk config
var errorLog  = chalk.red.bold,
	hintLog   = chalk.blue,
	changeLog = chalk.red;

// jsHint Options.
var hintOptions = JSON.parse(fs.readFileSync('.jshintrc', 'utf8'));


gulp.task('js:hint', function () {

	console.log('-------------------------------------------------- JS - HINT');
	var stream = gulp.src(['app/*.js', 'constant/*.js', 'controller/*.js', 'directive/*.js', 'factory/*.js', 'filter/*.js', 'filter/*.js', 'provider/*.js', 'route/*.js', 'service/*.js', 'style/*.js', 'test/*.js', 'value/*.js', 'view/*.js', 'gulpfile.js'])
		.pipe(gulpPlugins.jshint(hintOptions))
		.pipe(gulpPlugins.jshint.reporter(stylish));
	return stream;
});


gulp.task('watch', function () {
	
	console.log('watching all the files.....');

    var jsFiles = gulp.watch(['app/*.js', 'constant/*.js', 'controller/*.js', 'directive/*.js', 'factory/*.js', 'filter/*.js', 'filter/*.js', 'provider/*.js', 'route/*.js', 'service/*.js', 'style/*.js', 'test/*.js', 'value/*.js', 'view/*.js', 'gulpfile.js'], ['js:hint']);

	// Just to add log messages on Terminal, in case any file is changed
	var onChange = function (event) {
		console.log(changeLog('-------------------------------------------------->>>> File ' + event.path + ' was ------->>>> ' + event.type));
	};

	jsFiles.on('change', onChange);
});



gulp.task('default', ['watch', 'js:hint']);


