'use strict';

var gulp     = require('gulp'),
	stylish    = require('jshint-stylish'),
	path       = require('path'),
	connect    = require('connect'),
	http       = require('http'),
	open       = require('open'),
	tinylr     = require('tiny-lr'),
	livereload = tinylr(),
	fs         = require('fs'),
	chalk      = require('chalk'),
	args       = require('yargs').argv,
	browserSync = require('browser-sync'),
	runSequence = require('run-sequence'),
	map         = require('map-stream');

var gulpPlugins = require('gulp-load-plugins')();

var	SETTINGS = {
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
		require('connect-livereload')({ port: SETTINGS.livereloadPort }),
		connect.static(SETTINGS.build.app),
		connect.directory(SETTINGS.build.app)
	],

	app = connect.apply(null, middleware),
	server = http.createServer(app);
	server
		.listen(SETTINGS.serverPort)
		.on('listening', function () {
			console.log('Started connect web server on http://localhost:' + SETTINGS.serverPort + '.');
			open('http://localhost:' + SETTINGS.serverPort);
		});
});

gulp.task('tinylr', function () {
	livereload.listen(SETTINGS.livereloadPort, function (err) {
		if (err) {
			return console.log(err);
		}
	});
});

gulp.task('server', ['local:server', 'tinylr'], function () {
	console.log('------------------>>>> firing server  <<<<-----------------------');
});


/*============================================================
=                          JS-HINT                          =
============================================================*/

gulp.task('js:hint', function () {

	console.log('-------------------------------------------------- JS - HINT');
	var stream = gulp.src([SETTINGS.src.js + 'app.js', '!' + SETTINGS.src.js + 'plugins/*.js', SETTINGS.src.js + '**/*.js', 'gulpfile.js'])
		.pipe(gulpPlugins.jshint(hintOptions))
		.pipe(gulpPlugins.jshint.reporter(stylish));
	return stream;
});


/*============================================================
=                          Concat                           =
============================================================*/

gulp.task('concat', ['concat:bower', 'concat:js', 'concat:css']);


gulp.task('concat:bower', function () {
	console.log('-------------------------------------------------- CONCAT :bower');

	gulpPlugins.bowerFiles()
		.pipe(gulpPlugins.concat('_bower.min.js'))
		.pipe(gulpPlugins.uglify())
		.pipe(gulp.dest(SETTINGS.build.js))
		.pipe(gulpPlugins.livereload(livereload));
});

gulp.task('concat:js', ['js:hint'], function () {

	console.log('-------------------------------------------------- CONCAT :js');
	gulp.src([SETTINGS.src.js + 'plugins/*.js', SETTINGS.src.js + 'app.js', SETTINGS.src.js + '*.js', SETTINGS.src.js + '**/*.js'])
	    .pipe(gulpPlugins.concat('all.js'))
	    .pipe(gulpPlugins.if(isProduction, gulpPlugins.uglify()))
	    .pipe(gulp.dest(SETTINGS.build.js))
	    .pipe(gulpPlugins.livereload(livereload));
});

gulp.task('convert:scss', function () {
	console.log('-------------------------------------------------- COVERT - scss');
   
    var stream = gulp.src(SETTINGS.src.css + 'application.scss')
       .pipe(gulpPlugins.sass({includePaths: [SETTINGS.src.css]}))
       .pipe(gulp.dest(SETTINGS.scss))
       .pipe(gulpPlugins.livereload(livereload));
    return stream;
});

gulp.task('concat:css', ['convert:scss'], function () {

	console.log('-------------------------------------------------- CONCAT :css ');
	gulp.src([SETTINGS.src.css + 'reset-api.css', SETTINGS.src.css + 'fonts.css', SETTINGS.scss + 'application.css', SETTINGS.src.css + '*.css'])
	    .pipe(gulpPlugins.concat('styles.css'))
	    .pipe(gulpPlugins.if(isProduction, gulpPlugins.minifyCss({keepSpecialComments: '*'})))
	    .pipe(gulp.dest(SETTINGS.build.css))
	    .pipe(gulpPlugins.livereload(livereload));
});


/*============================================================
=                          Minify				            =
============================================================*/

gulp.task('image:min', function () {
	gulp.src(SETTINGS.src.images + '**')
        .pipe(gulpPlugins.imagemin())
        .pipe(gulp.dest(SETTINGS.build.images))
        .pipe(gulpPlugins.livereload(livereload));
});


/*============================================================
=                           Copy                            =
============================================================*/

gulp.task('copy', ['copy:html', 'copy:images', 'copy:fonts', 'copy:html:root']);


gulp.task('copy:html', function () {
	
	console.log('-------------------------------------------------- COPY :html');
	gulp.src([SETTINGS.src.templates + '*.html', SETTINGS.src.templates + '**/*.html'])
		.pipe(gulpPlugins.if(isProduction, gulpPlugins.minifyHtml({comments: false, quotes: true, spare: true, empty: true, cdata: true})))
		.pipe(gulp.dest(SETTINGS.build.templates))
		.pipe(gulpPlugins.livereload(livereload));
});

gulp.task('copy:html:root', function () {
	
	console.log('-------------------------------------------------- COPY :html:root');
	gulp.src(SETTINGS.src.app + '*.html')
		.pipe(gulpPlugins.if(isProduction, gulpPlugins.minifyHtml({comments: false, quotes: true, spare: true, empty: true, cdata: true})))
		.pipe(gulp.dest(SETTINGS.build.app))
		.pipe(gulpPlugins.livereload(livereload));
});

gulp.task('copy:images', function () {

	console.log('-------------------------------------------------- COPY :images');
	gulp.src([SETTINGS.src.images + '*.*', SETTINGS.src.images + '**/*.*'])
		.pipe(gulp.dest(SETTINGS.build.images));
});

gulp.task('copy:fonts', function () {

	console.log('-------------------------------------------------- COPY :fonts');
	gulp.src([SETTINGS.src.fonts + '*', SETTINGS.src.fonts + '**/*'])
		.pipe(gulp.dest(SETTINGS.build.fonts));
});


/*=========================================================================================================
=												Watch

	Incase the watch fails due to limited number of watches available on your sysmtem, the execute this
	command on terminal

	$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
=========================================================================================================*/
	
gulp.task('watch', function () {
	
	console.log('watching all the files.....');

	var watchedFiles = [];

	watchedFiles.push(gulp.watch([SETTINGS.src.css + '*.css',  SETTINGS.src.css + '**/*.css'],  ['concat:css']));
	
	watchedFiles.push(gulp.watch([SETTINGS.src.css + '*.scss', SETTINGS.src.css + '**/*.scss'], ['concat:css']));

    watchedFiles.push(gulp.watch([SETTINGS.src.js + '*.js',    SETTINGS.src.js + '**/*.js'],    ['concat:js']));

    watchedFiles.push(gulp.watch([SETTINGS.src.app + '*.html'], ['copy:html:root']));

	watchedFiles.push(gulp.watch([SETTINGS.src.images + '*.*', SETTINGS.src.images + '**/*.*'], ['copy:images']));

	watchedFiles.push(gulp.watch([SETTINGS.src.fonts + '*.*',  SETTINGS.src.fonts + '**/*.*'],  ['copy:fonts']));

	watchedFiles.push(gulp.watch([SETTINGS.src.bower + '*.js', SETTINGS.src.bower + '**/*.js'], ['concat:bower']));

	watchedFiles.push(gulp.watch([SETTINGS.src.templates + '*.html', SETTINGS.src.templates + '**/*.html'], ['copy:html']));


	// Just to add log messages on Terminal, in case any file is changed
	var onChange = function (event) {
		if (event.type == 'deleted') {
			runSequence('clean');
			setTimeout(function () {
				runSequence('copy', 'concat', 'watch');
			}, 500);
		}
		console.log(chalk.red('-------------------------------------------------->>>> File ' + event.path + ' was ------->>>> ' + event.type));
	};

	watchedFiles.forEach(function (watchedFile) {
		watchedFile.on('change', onChange);
	});
	
});


/*============================================================
=                             Clean                          =
============================================================*/

var cleanFiles = function (files, logMessage) {
	console.log('-------------------------------------------------- CLEAN :' + logMessage);
	gulp.src(files, {read: false})
		.pipe(gulpPlugins.clean({force: true}));
};

gulp.task('clean', function () {
	cleanFiles([SETTINGS.build.app], 'all files');
});

gulp.task('clean:css', function () {
	cleanFiles([SETTINGS.build.css], 'css');
});

gulp.task('clean:js', function () {
	cleanFiles([SETTINGS.build.js], 'js');
});

gulp.task('clean:html', function () {
	cleanFiles([SETTINGS.build.templates], 'html');
});

gulp.task('clean:images', function () {
	cleanFiles([SETTINGS.build.images], 'images');
});

gulp.task('clean:fonts', function () {
	cleanFiles([SETTINGS.build.fonts + '*.*', SETTINGS.build.fonts + '**/*.*'], 'fonts');
});

gulp.task('clean:zip', function () {
	cleanFiles(['zip/**/*', '!zip/build-*.zip'], 'zip');
});



/*============================================================
=                             Zip                          =
============================================================*/

gulp.task('zip', function () {
    gulp.src([SETTINGS.build.app + '*', SETTINGS.build.app + '**/*'])
        .pipe(gulpPlugins.zip('build-' + new Date() + '.zip'))
        .pipe(gulp.dest('./zip/'));

    setTimeout(function () {
		runSequence('clean:zip');
    }, 500); // wait for file creation
	    
});

/*============================================================
=                             Start                          =
============================================================*/


gulp.task('build', function () {
	console.log(chalk.blue('-------------------------------------------------- BUILD - Development Mode'));
	runSequence('copy', 'concat', 'watch');
});

gulp.task('build:prod', function () {
	console.log(chalk.blue('-------------------------------------------------- BUILD - Production Mode'));
	isProduction = true;
	runSequence('copy', 'concat', 'watch');
});

gulp.task('default', ['build', 'server']);

// Just in case you are too lazy to type: $ gulp --type production
gulp.task('prod', ['build:prod', 'server']);



/*============================================================
=                       Browser Sync                         =
============================================================*/

gulp.task('bs', function () {
    browserSync.init([SETTINGS.build.app + 'index.html', SETTINGS.build + 'templates/*.html', SETTINGS.build.css + '*css', SETTINGS.build.js + '*.js'], {
		proxy: {
            host: '127.0.0.1',
            port: SETTINGS.serverPort
        }
    });
});