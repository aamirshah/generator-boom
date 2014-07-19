'use strict';
var path = require('path'),
    util = require('util'),
    yeoman = require('yeoman-generator'),
    ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);

    this.option('scss', {
        desc: 'Save file as .scss',
        type: String,
        required: 'false'
    });

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
        'sample.css',
        path.join(
            this.env.options.appPath,
            'css',
            this.name.toLowerCase() + (this.options.scss ? '.scss' : '.css')
        )
    );
};
