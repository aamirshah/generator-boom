'use strict';
var util = require('util'),
    ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  
    ScriptBase.apply(this, arguments);

    this.option('skip', {
        desc: 'Skip the boilerplate code',
        type: String,
        required: 'false'
    });
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {

    if (this.options['skip']) {
        console.log('boilerplate code for provider is not added!');
        this.skip = true;
    } else {
        this.skip = false;
    }

    this.generateSourceAndTest(
        'provider',
        'spec/provider',
        'providers',
        this.options['add-index'] || false
    );
};
