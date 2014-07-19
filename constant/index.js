'use strict';
var util = require('util'),
    ScriptBase = require('../script-base.js'),
    path = require('path'),
    angularUtils = require('../util.js');

var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);

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

Generator.prototype.askForConstantValue = function askFor() {
    var cb = this.async();

    this.prompt([{
        type: 'input',
        name: 'constant',
        message: 'Enter the value for the constant \'' + this.name + '\' : '
    }], function (props) {

        this.constantValue = props.constant;

        if (typeof (this.constantValue) === 'string') {
            this.constantValue = '\'' + this.constantValue + '\'';
        }

        cb();
    }.bind(this));
};


Generator.prototype.createConstant = function createViewFiles() {

    var config = {
        file: path.join(
        this.env.options.appPath,
            'js/main.js'
        ),
        needle: '/* ---> Do not delete this comment (Constants) <--- */',
        splicable: [
            'app.constant(\'' + this.name + '\', ' + this.constantValue + ');'
        ]
    };
    angularUtils.rewriteFile(config);
    console.log('Added Constant :  ' + this.name);
};
