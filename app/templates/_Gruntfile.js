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
	            command: 'python -m SimpleHTTPServer <%%= shell.pythonServer.options.port %>' 
	        }
	    },
		
		watch: {
			bower:  { files: ['build/bower_components/**/**.js'], tasks: ['bower_concat', 'uglify'] },			
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
		        "angular"<% if (resourceModule) { %>,
			    "angular-resource"<% } if (cookiesModule) { %>,
			    "angular-cookies"<%  } if (sanitizeModule) { %>,
			    "angular-sanitize"<% } if (routeModule) { %>,
			    "angular-route"<%    } if (animateModule) { %>,
			    "angular-animate"<%  } if (ng_ui && utilsModule) { %>,
			    "angular-utils"<%    } if (ng_ui && bootstrapModule) { %>,
			    "angular-bootstrap"<%} if (ng_ui && uirouterModule) { %>,
			    "angular-ui-router"<%} if (ng_ui && gridModule) { %>,
			    "angular-ng-grid"<%  } if (jquery) { %>,
			    "jquery"<%           } if (zepto) { %>,
			    "zepto"<%            } if (modernizr) { %>,
			    "modernizr"<% } %>
		    ],
		    dependencies: {
				<% if (modernizr) { %>
				'modernizr': 'jquery',<%         } if (resourceModule) { %>
				'angular-resource': 'angular'<%  } if (cookiesModule) { %>,
				'angular-cookies': 'angular'<%   } if (sanitizeModule) { %>,
				'angular-sanitize': 'angular'<%  } if (routeModule) { %>,
				'angular-route': 'angular'<%     } if (animateModule) { %>,
				'angular-animate': 'angular'<%   } if (ng_ui && utilsModule) { %>,
				'angular-utils': 'angular'<%     } if (ng_ui && bootstrapModule) { %>,
				'angular-bootstrap': 'angular'<% } if (ng_ui && uirouterModule) { %>,
				'angular-ui-router': 'angular'<% } if (ng_ui && gridModule) { %>,
				'angular-ng-grid': 'angular'<%   } %>		        
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
	grunt.registerTask('bower', ['bower_concat','uglify', 'watch:bower']);
};