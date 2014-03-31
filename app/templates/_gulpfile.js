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
	fs         = require('fs'),
	chalk      = require('chalk'),
	args       = require('yargs').argv,
	browserSync = require('browser-sync'),
	runSequence = require('run-sequence');

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
 	var hintOptions = JSON.parse(fs.readFileSync('.jshintrc', 'utf8'));

 	// Flag for generating production code.
	var isProduction = args.type === 'production';


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

	gulp.task('tinylr', function () {
		livereload.listen(settings.livereloadPort, function (err){
			if (err) return console.log(err);
		});
	});

	gulp.task('server', ['local:server', 'tinylr'], function () {
		console.log('------------------>>>> firing server  <<<<-----------------------');
	});



/*============================================================
=                          JS-HINT                          =
============================================================*/

	gulp.task('js:hint', function() {

		console.log('-------------------------------------------------- JS - HINT');
		var stream = gulp.src([settings.src.js + 'app.js', '!' + settings.src.js + 'libs/*.js', settings.src.js + '**/*.js'])
			.pipe(jshint(hintOptions))
			.pipe(jshint.reporter(stylish));
		return stream;
	});


/*============================================================
=                          Concat                           =
============================================================*/

	gulp.task('concat', ['concat:js', 'concat:css']);

	gulp.task('concat:js', ['js:hint'], function () {
	
		console.log('-------------------------------------------------- CONCAT :js');
	  	gulp.src([settings.src.js + 'libs/*.js', settings.src.js + 'app.js', settings.src.js + '*.js', settings.src.js + '**/*.js'])
		    .pipe(concat("all.js"))
		    // .pipe(gulpif(isProduction, rename('all.min.js')))
		    .pipe(gulpif(isProduction, uglify()))
		    .pipe(gulp.dest(settings.build.js))		    
		    .pipe(refresh(livereload));        

		gulp.run('js:hint');
	});

	gulp.task('convert:scss', function () {
       console.log('-------------------------------------------------- COVERT - scss');
       
        var stream = gulp.src(settings.src.css + 'application.scss')
           .pipe(sass({includePaths: [settings.src.css]}))
           .pipe(gulp.dest(settings.scss))
           .pipe(refresh(livereload));
        return stream;           
    });

	gulp.task('concat:css', ['convert:scss'], function () {

		console.log('-------------------------------------------------- CONCAT :css ');	  		  		
	  	gulp.src([settings.src.css + 'fonts.css', settings.scss + 'application.css', settings.src.css + '*.css'])
		    .pipe(concat('styles.css'))
		    // .pipe(gulpif(isProduction, rename('styles.min.css')))
		    .pipe(gulpif(isProduction, minifyCSS({keepSpecialComments: '*'})))
		    .pipe(gulp.dest(settings.build.css))
		    .pipe(refresh(livereload));
	});

	



/*============================================================
=                          Minify				            =
============================================================*/



	gulp.task('image:min', function () {
	    gulp.src(settings.src.images+'*.*')
	        .pipe(imagemin())
	        .pipe(gulp.dest(settings.build.images))
	        .pipe(refresh(livereload));
	});



/*============================================================
=                           Copy                            =
============================================================*/

	gulp.task('copy', ['copy:html', 'copy:images', 'copy:fonts', 'copy:html:root']);

	
	gulp.task('copy:html', function () {
		
		console.log('-------------------------------------------------- COPY :html');
		gulp.src([settings.src.templates + '*.html', settings.src.templates + '**/*.html'])
			.pipe(gulpif(isProduction, minifyHTML({comments: false, quotes: true, spare:true, empty: true, cdata:true})))
			.pipe(gulp.dest(settings.build.templates))
			.pipe(refresh(livereload));
	});

	gulp.task('copy:html:root', function() {
		
		console.log('-------------------------------------------------- COPY :html:root');
		gulp.src(settings.src.app + '*.html')
			.pipe(gulpif(isProduction, minifyHTML({comments: false, quotes: true, spare:true, empty: true, cdata:true})))
			.pipe(gulp.dest(settings.build.app))
			.pipe(refresh(livereload));
	});

	gulp.task('copy:images', function() {

		console.log('-------------------------------------------------- COPY :images');
		gulp.src([settings.src.images + '*.*', settings.src.images + '**/*.*'])
			.pipe(gulp.dest(settings.build.images));
	});
 
 	gulp.task('copy:fonts', function() {

 		console.log('-------------------------------------------------- COPY :fonts');
		gulp.src([settings.src.fonts + '*', settings.src.fonts + '**/*'])
			.pipe(gulp.dest(settings.build.fonts));
	});



/*=========================================================================================================
=												Watch

	Incase the watch fails due to limited number of watches available on your sysmtem, the execute this
	command on terminal

	$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
=========================================================================================================*/

	gulp.task('watch', function () {
		
		console.log('watching all the files.....');

		var cssFiles   = gulp.watch([settings.src.css + '*.css',  settings.src.css + '**/*.css'],  ['concat:css']);
		
		var scssFiles  = gulp.watch([settings.src.css + '*.scss', settings.src.css + '**/*.scss'], ['concat:css']);

        var jsFiles    = gulp.watch([settings.src.js + '*.js',    settings.src.js + '**/*.js'],    ['concat:js']);

        var indexFile  = gulp.watch([settings.src.app + '*.html'], ['copy:html:root']);

		var imageFiles = gulp.watch([settings.src.images + '*.*', settings.src.images + '**/*.*'], ['copy:images']);

		var fontFiles  = gulp.watch([settings.src.fonts + '*.*',  settings.src.fonts + '**/*.*'],  ['copy:fonts']);

		var libFiles   = gulp.watch([settings.src.bower + '*.js', settings.src.bower + '**/*.js'], ['grunt-bower']);

		var templateFiles = gulp.watch([settings.src.templates + '*.html', settings.src.templates + '**/*.html'], ['copy:html']);


		// Just to add log messages on Terminal, in case any file is changed
		var printLogMsg = function (event) {
			console.log(chalk.red('-------------------------------------------------->>>> File ' + event.path + ' was ------->>>> ' + event.type));
		};

		cssFiles.on     ('change', printLogMsg);
		scssFiles.on    ('change', printLogMsg);
		jsFiles.on      ('change', printLogMsg);
		indexFile.on    ('change', printLogMsg);
		imageFiles.on   ('change', printLogMsg);
		fontFiles.on    ('change', printLogMsg);
		libFiles.on     ('change', printLogMsg);
		templateFiles.on('change', printLogMsg);
	});


/*============================================================
=                             Clean                          =
============================================================*/

	gulp.task('clean', function () {
	
		// gulp.run('clean:css', 'clean:js', 'clean:html', 'clean:images', 'clean:fonts');
	    gulp.src([settings.build.app], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:css', function () {

		console.log('-------------------------------------------------- CLEAN :css');
	    gulp.src([settings.build.css], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:js', function () {

		console.log('-------------------------------------------------- CLEAN :js');
	    gulp.src([settings.build.js], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:html', function () {

		console.log('-------------------------------------------------- CLEAN :html');
	    gulp.src([settings.build.templates], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:images', function () {

		console.log('-------------------------------------------------- CLEAN :images');
	    gulp.src([settings.build.images], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:fonts', function () {

		console.log('-------------------------------------------------- CLEAN :fonts');
	    gulp.src([settings.build.fonts+'*.*', settings.build.fonts+'**/*.*'], {read: false})
	        .pipe(clean({force: true}));
	});

	gulp.task('clean:zip', function () {

		console.log('-------------------------------------------------- CLEAN :Zip');
		gulp.src(['zip/**/*', '!zip/build-*.zip'], {read: false})
        	.pipe(clean({force: true}));
	});


/*============================================================
=                             Zip                          =
============================================================*/

	gulp.task('zip', function () {
	    gulp.src([settings.build.app + '*', settings.build.app + '**/*'])
	        .pipe(zip('build-' + new Date() + '.zip'))
	        .pipe(gulp.dest('./zip/'));	 

	    setTimeout(function(){	    	
	    	gulp.run('clean:zip');   
	    }, 500); // wait for file creation
		    
	});



/*============================================================
=                             Start                          =
============================================================*/


	gulp.task('bower', ['grunt-bower'], function() {
	    console.log('Executed Grunts Bower Concat Module');
	});

	gulp.task('build', function(){
		console.log(chalk.blue('-------------------------------------------------- BUILD - Development Mode'));
		runSequence('copy', 'concat', 'watch');
	});

	gulp.task('build:prod', function(){
		console.log(chalk.blue('-------------------------------------------------- BUILD - Production Mode'));
		isProduction = true;
		runSequence('copy', 'concat', 'watch');
	});

	gulp.task('default', ['grunt-bower', 'build', 'server']);

	// Just in case you are too lazy to type: $ gulp --type production
	gulp.task('prod', ['grunt-bower', 'build:prod', 'server']);


/*============================================================
=                       Browser Sync                         =
============================================================*/

	gulp.task('sync', function() {
	    browserSync.init([settings.build.app + 'index.html', settings.build + 'templates/*.html', settings.build.css + '*.css', settings.build.js + '*.js'], {
	         proxy: {
	            host: '127.0.0.1',
	            port: settings.serverPort
	        }
	    });
	});


