'use strict';
var util = require('util'),
	ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.option('api', {
    desc: 'Adding test in api folder',
    type: String,
    required: 'true'
  });
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createTestFiles = function () {

	if (this.options['api']) {
		
		this.generateTestFile('testAPISkeleton', 'api');
		return false;
	}

	this.generateTestFile('testSkeleton', 'e2e');
};
