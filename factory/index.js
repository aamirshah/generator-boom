'use strict';
var util = require('util'),
  ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.option('api', {
    desc: 'Adding api skeleton',
    type: String,
    required: 'true'
  });
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {

  if (this.options['api']) {
    console.log('Adding the API skeleton');
    this.inject = '$resource';
  } else {
    this.inject = '$rootScope';
  }
  
  this.generateSourceAndTest(
    'factory',
    'spec/factories',
    'factories',
    this.options['add-index'] || false
  );
};
