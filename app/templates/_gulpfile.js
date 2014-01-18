'use strict';

var gutil = require('gulp-util'),
	gulp = require('gulp'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	gzip = require("gulp-gzip"),
	imagemin = require('gulp-imagemin'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	gulpif = require('gulp-if'),
	jshint = require('gulp-jshint');
	
	
	require('gulp-grunt')(gulp); 
	
	
var isProduction = true;


gulp.task('server', function() {
    gulp.run('grunt-python_server');
});

gulp.task('bower', function() {
    gulp.run('grunt-bower');
});



var jshint = require('gulp-jshint');

gulp.task('ylint', function() {
  gulp.src('app/js/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('./build'));
});



gulp.task('lint', function() {
  gulp.src('app/js/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('gg', function(){


	console.log("aamir....");
 
    gulp.run('shell');
});




gulp.task('lint', function() {
    gulp.src('app/scripts/test.js', 'app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/*============================================================
=                          Concat                           =
============================================================*/

	gulp.task('concat', function(){
		console.log('concat');
		gulp.run('concat:js','convert:scss', 'concat:css')
	});

	gulp.task('concat:js', function() {
		console.log('isProduction  ', isProduction);
	  	gulp.src(['app/js/main.js', 'app/js/**/*.js'])
		    .pipe(concat("all.js"))
		    .pipe(gulp.dest('./build/js/'))
		    .pipe(gulpif(isProduction, rename('all.min.js')))
		    .pipe(gulpif(isProduction, uglify()))
		    .pipe(gulpif(isProduction, gzip()))
		    .pipe(gulpif(isProduction, gulp.dest('./build/js/')));        
	});

	
	gulp.task('convert:scss', function () {

	    gulp.src('app/css/*.scss')
	        .pipe(sass())
	        .pipe(gulp.dest('./scss/'));
	});


	gulp.task('concat:css', function() {

	  	gulp.src(['app/css/*.css', 'app/css/**/*.css', 'app/scss/*.css'])
		    .pipe(concat("styles.css"))
		    .pipe(gulp.dest('./build/css/'))
		    .pipe(gulpif(isProduction, rename('styles.min.css')))
		    .pipe(gulpif(isProduction, minifyCSS({keepSpecialComments: '*'})))
		    .pipe(gulpif(isProduction, gzip()))
		    .pipe(gulpif(isProduction, gulp.dest('./build/css')));        
	});

	



/*============================================================
=                          Minify				            =
============================================================*/



	gulp.task('image:min', function () {
	    gulp.src('app/images/*.png')
	        .pipe(imagemin())
	        .pipe(gulp.dest('./build/images'));
	});



/*============================================================
=                           Copy                            =
============================================================*/

	gulp.task('copy', function() {
		console.log('copy');
		gulp.run('copy:html', 'copy:images', 'copy:fonts');
	});

	
	gulp.task('copy:html', function() {

		gulp.src('app/templates/*.html')
			.pipe(gulpif(isProduction, minifyHTML({comments: false})))
			.pipe(gulp.dest('./build/templates/'));
	});

	gulp.task('copy:html:root', function() {

		gulp.src('app/*.html')
			.pipe(gulpif(isProduction, minifyHTML({comments: false})))
			.pipe(gulp.dest('./build/'));
	});

	gulp.task('copy:images', function() {

		gulp.src('app/images/**')
			.pipe(gulp.dest('./build/images/'));
	});
 
 	gulp.task('copy:fonts', function() {

		gulp.src('app/fonts/**')
			.pipe(gulp.dest('./build/fonts/'));
	});



/*============================================================
=                           Watch        	                =
============================================================*/

	gulp.task('watch', function(){
		console.log('watch');
		gulp.run('watch:css', 'watch:scss', 'watch:js', 'watch:html', 'watch:html:root', 'watch:images', 'watch:fonts');
	});

	gulp.task('watch:css', function () {
		console.log('watch:css');
		gulp.watch(['app/css/*.css', 'app/css/**/*.css'], function() {			
			gulp.run('concat:css');
		});
	});

	gulp.task('watch:scss', function () {
		console.log('watch:scss');
		gulp.watch(['app/css/*.scss', 'app/css/**/*.scss'], function() {
			gulp.run('convert:scss', 'concat:css');
		});
	});

	gulp.task('watch:js', function () {
		console.log('watch:js');
		gulp.watch(['app/js/*.js', 'app/js/**/*.js'], function() {
			gulp.run('concat:js');
		});
	});

	gulp.task('watch:html', function () {
		console.log('watch:html');
		gulp.watch(['app/templates/*.html', 'app/templates/**/*.html'], function() {
			gulp.run('copy:html');
		});
	});

	gulp.task('watch:html:root', function () {
		console.log('watch:html:root');
		gulp.watch(['app/*.html'], function() {
			gulp.run('copy:html:root');
		});
	});

	gulp.task('watch:images', function () {

		gulp.watch(['app/images/**', 'app/templates/**/**'], function() {
			gulp.run('copy:images');
		});
	});

	gulp.task('watch:fonts', function () {
		console.log('watch:fonts');
		gulp.watch(['app/fonts/**', 'app/fonts/**/**'], function() {
			gulp.run('copy:fonts');
		});
	});



/*============================================================
=                             Clean                          =
============================================================*/

	gulp.task('clean', function() {
		console.log('clean');
		// gulp.run('clean:css', 'clean:js', 'clean:html', 'clean:images', 'clean:fonts');
	    gulp.src(['build/'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:css', function() {
	    gulp.src(['build/css/'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:js', function() {
	    gulp.src(['build/js/'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:html', function() {
	    gulp.src(['build/templates/'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:images', function() {
	    gulp.src(['build/images/'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:fonts', function() {
	    gulp.src(['build/fonts/**', 'build/fonts/**/**'], {read: false})
	        .pipe(clean({force: true}));
	});


/*============================================================
=                             Start                          =
============================================================*/


gulp.task('build', function(){
	isProduction = false;
	gulp.run('copy', 'concat', 'watch', 'copy:html:root', 'watch:html:root');
});

gulp.task('build:prod', function(){
	isProduction = true;
	gulp.run('copy', 'concat', 'watch', 'copy:html:root', 'watch:html:root');
});
