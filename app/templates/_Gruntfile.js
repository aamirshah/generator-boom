'use strict';

var path = require('path');


module.exports = function (grunt) {

    grunt.initConfig({
  		pkg: grunt.file.readJSON('package.json'),
	  
		
		shell: {
	        pythonServer: {
	            options: {
	                port: '9000'
	            },
	            command: 'python -m SimpleHTTPServer <%= shell.pythonServer.options.port %>' 
	        }
	    },
		
		watch: {
			js:  { files: ['build/js/_bower.js'], tasks: ['uglify'] },			
		},

		uglify: {
	        files: { 
	            src: 'build/js/_bower.js',  // source files mask
	            dest: 'build/js/',    // destination folder
	            expand: true,    // allow dynamic building
	            flatten: true,   // remove all unnecessary nesting
	            ext: '.min.js'   // replace .js to .min.js
	        }
	    },

	    bower_concat: {
		  all: {
		    dest: 'build/js/_bower.js',
		    include: [
		        'modernizr',
		        'jquery',
		        'angular',
		        'angular-animate',
		        'angular-resource',
		        'angular-route'				        
		    ],
		    dependencies: {
		   		'modernizr': 'jquery',
		   		'angular-animate': 'angular',
		        'angular-resource': 'angular',
		        'angular-route': 'angular'		        
		    },
		    bowerOptions: {
		      relative: true
		    }
		  }
		}
	});

	// load plugins	
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('python_server', [ 'shell' ]);
	grunt.registerTask('bower', [ 'bower_concat', 'uglify']);
	 

};