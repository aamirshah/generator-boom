'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    angularUtils = require('../util.js');

var fs = require('fs');

var Generator = module.exports = function Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    this.env.options.angularDeps = '';
  
    this.option('app-suffix', {
        desc: 'Allow a custom suffix to be added to the module name',
        type: String,
        required: 'true'
    });

    this.scriptAppName = this.appname + angularUtils.appName(this);

    args = ['main'];

    if (typeof this.env.options.appPath === 'undefined') {
        try {
            this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
        } catch (e) {

        }
        this.env.options.appPath = this.env.options.appPath || 'app';
    }

    this.appPath = this.env.options.appPath;

    this.on('end', function () {
        this.installDependencies({
            skipInstall: options['skip-install']
        });
    });

    var enabledComponents = [];

    if (this.resourceModule) {
        enabledComponents.push('angular-resource/angular-resource.js');
    }

    if (this.cookiesModule) {
        enabledComponents.push('angular-cookies/angular-cookies.js');
    }

    if (this.sanitizeModule) {
        enabledComponents.push('angular-sanitize/angular-sanitize.js');
    }

    if (this.routeModule) {
        enabledComponents.push('angular-route/angular-route.js');
    }

    if (this.animateModule) {
        enabledComponents.push('angular-animate/angular-animate.js');
    }

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {

    // welcome message
    if (!this.options['skip-welcome-message']) {

        console.log('Welcome to the Boom Angular.js WebApp Generator.\n');
        // have Yeoman greet the user.
        console.log(this.yeoman);
    }
};

Generator.prototype.askForLib = function askFor() {
    var cb = this.async();
    this.prompt([{
        type: 'list',
        name: 'which',
        message: 'Which library would you like to add :',
        choices: ['none', 'jQuery', 'zepto']
    }], function (props) {
        if (props.which === 'jQuery') {
            this.jquery = true;
            this.zepto = false;
        } else if (props.which === 'zepto') {
            this.zepto = true;
            this.jquery = false;
        } else {
            this.jquery = false;
            this.zepto = false;
        }
        cb();
    }.bind(this));
};

Generator.prototype.askForModernizr = function askFor() {
    var cb = this.async();
    this.prompt([{
        type: 'confirm',
        name: 'modernizr',
        message: 'Would you like to include Modernizr ?',
        default: false
    }], function (props) {
        this.modernizr = props.modernizr;
        cb();
    }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
    var cb = this.async();

    var prompts = [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which modules would you like to include ?',
        choices: [{
            value: 'resourceModule',
            name: 'angular-resource.js',
            checked: true
        }, {
            value: 'cookiesModule',
            name: 'angular-cookies.js',
            checked: true
        }, {
            value: 'sanitizeModule',
            name: 'angular-sanitize.js',
            checked: true
        }, {
            value: 'routeModule',
            name: 'angular-route.js',
            checked: true
        }, {
            value: 'animateModule',
            name: 'angular-animate.js',
            checked: true
        }]
    }];

    this.prompt(prompts, function (props) {
        var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
        this.resourceModule = hasMod('resourceModule');
        this.cookiesModule = hasMod('cookiesModule');
        this.sanitizeModule = hasMod('sanitizeModule');
        this.routeModule = hasMod('routeModule');
        this.animateModule = hasMod('animateModule');

        var angMods = [];

        if (this.cookiesModule) {
          angMods.push('"ngCookies"');
          }

          if (this.resourceModule) {
              angMods.push('"ngResource"');
          }

          if (this.sanitizeModule) {
              angMods.push('"ngSanitize"');
          }

          if (this.routeModule) {      
              angMods.push('"ngRoute"');
              this.env.options.ngRoute = true;
          }

          if (this.animateModule) {      
              angMods.push('"ngAnimate"');
          }

          if (angMods.length) {
              this.env.options.angularDeps = this.env.options.angularDeps + angMods.join(", ");
          }

          this.angularModules = this.env.options.angularDeps;
          this.ngRoute = this.env.options.ngRoute;

          cb();
        }.bind(this));
    };

Generator.prototype.askForAngularUI = function askFor() {
    var cb = this.async();
  
    this.prompt([{
        type: 'confirm',
        name: 'ng_ui',
        message: 'Would you like to include AngularUI ?',
        default: false
    }], function (props) {

        this['ng_ui'] = props['ng_ui'];

        if (this.['ng_ui']) {
            this.callUIModule = true;
        }

        cb();
    }.bind(this));
};

Generator.prototype.askForUI = function (){

    if (!this.callUIModule) {
        return false;
    }

    var cb = this.async();

    var prompts = [{
        type: 'checkbox',
        name: 'uimodules',
        message: 'Which AngularUI modules would you like to include?',
        choices: [{
            value: 'utilsModule',
            name: 'angular-ui-utils.js',
            checked: false
        }, {
            value: 'bootstrapModule',
            name: 'angular-bootstrap.js',
            checked: false
        }, {
            value: 'uirouterModule',
            name: 'angular-ui-router.js',
            checked: false
        }, {
            value: 'gridModule',
            name: 'angular-ng-grid.js',
            checked: false
        }]
    }];

    this.prompt(prompts, function (props) {
        var hasMod = function (mod) { return props.uimodules.indexOf(mod) !== -1; };
        this.utilsModule = hasMod('utilsModule');
        this.bootstrapModule = hasMod('bootstrapModule');
        this.uirouterModule = hasMod('uirouterModule');
        this.gridModule = hasMod('gridModule');

        var angMods = [];

        if (this.utilsModule) {
            angMods.push('"ui.utils"');
        }

        if (this.bootstrapModule) {
            angMods.push('"ui.bootstrap"');
        }

        if (this.uirouterModule) {
            angMods.push('"ui.router"');
        }

        if (this.gridModule) {
            angMods.push('"ngGrid"');
            this.env.options.ngUIRoute = true;
        }

        if (angMods.length) {
            if (this.env.options.angularDeps.length) {
                this.env.options.angularDeps = this.env.options.angularDeps + ', ' + angMods.join(', ');
            } else {
                this.env.options.angularDeps = this.env.options.angularDeps + angMods.join(', ');
            }
        }

        this.angularModules = this.env.options.angularDeps;
        this.ngUIRoute = this.env.options.ngRoute;

        cb();
    }.bind(this));
};

Generator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/templates');
    this.mkdir('app/css');
    this.mkdir('app/js');
    this.mkdir('app/js/controllers');
    this.mkdir('app/js/directives');
    this.mkdir('app/js/filters');
    this.mkdir('app/js/factories');
    this.mkdir('app/js/services');
    this.mkdir('app/js/providers');
    this.mkdir('app/js/libs');
    this.mkdir('app/img');
    this.mkdir('app/fonts');

    this.mkdir('tests/e2e/');
    this.mkdir('tests/api/');

    this.jsFile = this.engine(this.read('../../templates/app.js'), this);
    this.write(path.join(this.appPath, '/js/app.js'), this.jsFile);

    this.scssFile = this.engine(this.read('../../templates/application.scss'), this);
    this.write(path.join(this.appPath, '/css/application.scss'), this.scssFile);

    this.homeFile = this.engine(this.read('../../templates/home.html'), this);
    this.write(path.join(this.appPath, '/templates/home.html'), this.homeFile);

    this.testConfigAPIFile = this.engine(this.read('../../templates/testConfigAPI.js'), this);
    this.write('./tests/all_api.js', this.testConfigAPIFile);

    this.testConfigE2EFile = this.engine(this.read('../../templates/testConfigE2E.js'), this);
    this.write('./tests/all_e2e.js', this.testConfigE2EFile);

    this.testFile = this.engine(this.read('../../templates/sampleTest.js'), this);
    this.write('./tests/e2e/sample_test.js', this.testFile);

    this.cssFile = this.engine(this.read('../../templates/main.css'), this);
    this.write(path.join(this.appPath, '/css/main.css'), this.cssFile);


    this.copy('_fonts.css', path.join(this.appPath, '/css/fonts.css'));
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_.bowerrc', '.bowerrc');
    this.copy('_gulpfile.js', 'gulpfile.js');
};

Generator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('_.gitignore', '.gitignore');
    this.copy('_README.md', 'README.md');
};

Generator.prototype.readIndex = function readIndex() {
    this.indexFile = this.engine(this.read('../../templates/index.html'), this);
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
    this.indexFile = this.indexFile.replace(/&apos;/g, '\'');
    this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};