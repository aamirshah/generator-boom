'use strict';

var gutil      = require('gulp-util'),
	gulp       = require('gulp'),
	clean      = require('gulp-clean'),
	concat     = require('gulp-concat'),
	uglify     = require('gulp-uglify'),
	rename     = require('gulp-rename'),
	sass       = require('gulp-sass'),
	minifyCSS  = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	gzip       = require("gulp-gzip"),
	imagemin   = require('gulp-imagemin'),
	watch      = require('gulp-watch'),
	plumber    = require('gulp-plumber'),
	gulpif     = require('gulp-if'),
	jshint     = require('gulp-jshint'),
	stylish    = require('jshint-stylish'),
	path       = require('path'),
	connect    = require('connect'),
	http       = require('http'),
	open       = require('open'),
	refresh    = require('gulp-livereload'),
	tinylr     = require('tiny-lr'),
	livereload = tinylr(),
	zip        = require('gulp-zip'),
	fs         = require('fs');

	require('gulp-grunt')(gulp); 
	

	var	settings = {
		livereloadPort: 35729,
		serverPort: 9000,
		src: {
			app: 'app/',
			css: 'app/css/',			
			js: 'app/js/',				
			templates: 'app/templates/',				
			images: 'app/images/',
			fonts: 'app/fonts/',
			bower: 'bower_components/'			
		},
		build: {
			app: 'build/',
			css: 'build/css/',
			js: 'build/js/',				
			templates: 'build/templates/',				
			images: 'build/images/',
			fonts: 'build/fonts/',
			bower: 'bower_components/'			
		},
		scss: 'scss/'  
	};
 
 	// jsHint Options.
 	var hintOptions = JSON.parse(fs.readFileSync(".jshintrc", "utf8"));

 	// Flag for generating production code.
	var isProduction = true;


/*============================================================
=                          Server (Live - Reload)            =
============================================================*/

	gulp.task('local:server', function () {
	
		var middleware = [
			require('connect-livereload')({ port: settings.livereloadPort }),
			connect.static(settings.build.app),
			connect.directory(settings.build.app)
		],

		app = connect.apply(null, middleware),
		server = http.createServer(app);
		server
			.listen(settings.serverPort)
			.on('listening', function() {
				console.log('Started connect web server on http://localhost:' + settings.serverPort + '.');
				open('http://localhost:' + settings.serverPort);
			});
	});

	gulp.task('tinylr', function(){
		livereload.listen(settings.livereloadPort, function(err){
			if (err) return console.log(err);
		});
	});

	gulp.task('server', function () {
		console.log('firing server');
		
		gulp.run('local:server', 'tinylr');
	});



/*============================================================
=                          JS-HINT                          =
============================================================*/

	gulp.task('js:hint', function() {

		console.log('-------------------------------------------------- JS - HINT');
		gulp.src([settings.src.js+'main.js', settings.src.js+'**/*.js'])
			.pipe(jshint(hintOptions))
			.pipe(jshint.reporter(stylish));
	});


/*============================================================
=                          Concat                           =
============================================================*/

	gulp.task('concat', function(){
	
		gulp.run('concat:js','convert:scss', 'concat:css');
	});

	gulp.task('concat:js', function() {
	
		console.log('-------------------------------------------------- CONCAT :js');
	  	gulp.src([settings.src.js+'libs/*.js', settings.src.js+'main.js', settings.src.js+'**/*.js'])
		    .pipe(concat("all.js"))
		    .pipe(gulp.dest('./build/js/'))
		    .pipe(gulpif(isProduction, rename('all.min.js')))
		    .pipe(gulpif(isProduction, uglify()))
		    .pipe(gulpif(isProduction, gzip()))
		    .pipe(gulpif(isProduction, gulp.dest(settings.build.js)))
		    .pipe(refresh(livereload));        

		gulp.run('js:hint');
	});

	gulp.task('convert:scss', function () {
       console.log('-------------------------------------------------- COVERT - scss');
       
        gulp.src(settings.src.css+'application.scss')
           .pipe(sass({includePaths: [settings.src.css]}))
           .pipe(gulp.dest(settings.scss))
           .pipe(refresh(livereload));
    });

	gulp.task('concat:css', function() {

		console.log('-------------------------------------------------- CONCAT :css ');
	  	gulp.src([settings.src.css+'*.css', settings.src.css+'**/*.css', settings.scss+'application.css'])	  		
		    .pipe(concat("styles.css"))
		    .pipe(gulp.dest(settings.build.css))
		    .pipe(gulpif(isProduction, rename('styles.min.css')))
		    .pipe(gulpif(isProduction, minifyCSS({keepSpecialComments: '*'})))
		    .pipe(gulpif(isProduction, gzip()))
		    .pipe(gulpif(isProduction, gulp.dest(settings.build.css)))
		    .pipe(refresh(livereload));
	});

	



/*============================================================
=                          Minify				            =
============================================================*/



	gulp.task('image:min', function () {
	    gulp.src(settings.src.images+'**')
	        .pipe(imagemin())
	        .pipe(gulp.dest(settings.build.images))
	        .pipe(refresh(livereload));
	});



/*============================================================
=                           Copy                            =
============================================================*/

	gulp.task('copy', function() {
	
		gulp.run('copy:html', 'copy:images', 'copy:fonts', 'copy:html:root');
	});

	
	gulp.task('copy:html', function() {
		
		console.log('-------------------------------------------------- COPY :html');
		gulp.src(settings.src.templates+'*.html')
			.pipe(gulpif(isProduction, minifyHTML({comments: false})))
			.pipe(gulp.dest(settings.build.templates))
			.pipe(refresh(livereload));
	});

	gulp.task('copy:html:root', function() {
		
		console.log('-------------------------------------------------- COPY :html:root');
		gulp.src(settings.src.app+'*.html')
			.pipe(gulpif(isProduction, minifyHTML({comments: false})))
			.pipe(gulp.dest(settings.build.app))
			.pipe(refresh(livereload));
	});

	gulp.task('copy:images', function() {

		console.log('-------------------------------------------------- COPY :images');
		gulp.src(settings.src.images+'*')
			.pipe(gulp.dest(settings.build.images));
	});
 
 	gulp.task('copy:fonts', function() {

 		console.log('-------------------------------------------------- COPY :fonts');
		gulp.src(settings.src.fonts+'*')
			.pipe(gulp.dest(settings.build.fonts));
	});



/*============================================================
=                           Watch        	                =
============================================================*/
	
	gulp.task('watch', function(){
	
		gulp.run('watch:css', 'watch:scss', 'watch:js', 'watch:html', 'watch:html:root', 'watch:images', 'watch:fonts', 'watch:bower', 'watch:html:root');
	});

	gulp.task('watch:css', function () {
		console.log('path = ', settings.src.css+'*.css');
		gulp.watch([settings.src.css+'*.css', settings.src.css+'**/*.css'], function() {
			console.log('-------------------------------------------------- CHANGE .css File');
			gulp.run('concat:css');
		});
	});


	gulp.task('watch:scss', function () {
   
        gulp.watch([settings.src.css+'*.scss', settings.src.css+'**/*.scss'], function() {
            console.log('-------------------------------------------------- CHANGE .Scss File');
            gulp.run('convert:scss');

            setTimeout(function(){
            	gulp.run('concat:css');
            }, 500);
        });
    });

	gulp.task('watch:js', function () {
	
		gulp.watch([settings.src.js+'*.js', settings.src.js+'**/*.js'], function() {
			console.log('-------------------------------------------------- CHANGE .js File');
			gulp.run('concat:js');
		});
	});

	gulp.task('watch:html', function () {
	
		gulp.watch([settings.src.templates+'*.html', settings.src.templates+'**/*.html'], function() {
			console.log('-------------------------------------------------- CHANGE .HTML File');
			gulp.run('copy:html');
		});
	});

	gulp.task('watch:html:root', function () {
						
		gulp.watch([settings.src.app+'*.html'], function() {
			console.log('-------------------------------------------------- CHANGE Root .html File');
			gulp.run('copy:html:root');
		});
	});

	gulp.task('watch:images', function () {

		gulp.watch([settings.src.images+'*.*', settings.src.images+'**/*.*'], function() {
			console.log('-------------------------------------------------- CHANGE /images/* File');
			gulp.run('copy:images');
		});
	});

	gulp.task('watch:fonts', function () {
	
		gulp.watch([settings.src.fonts+'*.*', settings.src.fonts+'**/*.*'], function() {
			console.log('-------------------------------------------------- CHANGE /fonts/* File');
			gulp.run('copy:fonts');
		});
	});

	gulp.task('watch:bower', function () {
		
		gulp.watch([settings.src.bower+'*.js', settings.src.bower+'**/*.js'], function() {
			console.log('-------------------------------------------------- CHANGE bower_components/* File');
			gulp.run('grunt-bower');
		});
	});


/*============================================================
=                             Clean                          =
============================================================*/

	gulp.task('clean', function() {
	
		// gulp.run('clean:css', 'clean:js', 'clean:html', 'clean:images', 'clean:fonts');
	    gulp.src([settings.build.app], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:css', function() {

		console.log('-------------------------------------------------- CLEAN :css');
	    gulp.src([settings.build.css], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:js', function() {

		console.log('-------------------------------------------------- CLEAN :js');
	    gulp.src([settings.build.js], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:html', function() {

		console.log('-------------------------------------------------- CLEAN :html');
	    gulp.src([settings.build.templates], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:images', function() {

		console.log('-------------------------------------------------- CLEAN :images');
	    gulp.src([settings.build.images], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:fonts', function() {

		console.log('-------------------------------------------------- CLEAN :fonts');
	    gulp.src([settings.build.fonts+'*.*', settings.build.fonts+'**/*.*'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:zip', function(){

		console.log('-------------------------------------------------- CLEAN :Zip');
		gulp.src(['zip/**/*', '!zip/build-*.zip'], {read: false})
        	.pipe(clean({force: true}));
	});


/*============================================================
=                             Zip                          =
============================================================*/

	gulp.task('zip', function () {
	    gulp.src([settings.build.app+'*', settings.build.app+'**/*'])
	        .pipe(zip('build-' + new Date() + '.zip'))
	        .pipe(gulp.dest('./zip/'));	 

	    setTimeout(function(){	    	
	    	gulp.run('clean:zip');   
	    }, 500); // wait for file creation
		    
	});



/*============================================================
=                             Start                          =
============================================================*/


	gulp.task('bower', function() {
	    gulp.run('grunt-bower'); // Concat & Uglify
	});

	gulp.task('build', function(){
		console.log('-------------------------------------------------- BUILD - Development Mode');
		isProduction = false;
		gulp.run('copy', 'concat', 'watch');
	});

	gulp.task('build:prod', function(){
		console.log('-------------------------------------------------- BUILD - Production Mode');
		isProduction = true;
		gulp.run('copy', 'concat', 'watch');
	});

	gulp.task('default', function() {
	    gulp.run('grunt-bower', 'build', 'server');
	});
