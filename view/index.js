'use strict';
var path = require('path'),
    util = require('util'),
    yeoman = require('yeoman-generator'),
    ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);

    this.option('c', {
        desc: 'Skip adding the controller',
        type: String,
        required: 'true'
    });

    this.option('css', {
        desc: 'Skip adding css file',
        type: String,
        required: 'true'
    });

    if (!this.options.css) {
        this.hookFor('boom:style');
    }

    if (!this.options.c) {
        this.hookFor('boom:controller');
    }

    this.sourceRoot(path.join(__dirname, '../templates'));

    if (typeof this.env.options.appPath === 'undefined') {
        try {
            this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
        } catch (e) {

        }
        this.env.options.appPath = this.env.options.appPath || 'app';
    }
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createViewFiles = function createViewFiles() {
    this.template(
        'view.html',
        path.join(
            this.env.options.appPath,
            'templates',
            this.name.toLowerCase() + '.html'
        )
    );
};
