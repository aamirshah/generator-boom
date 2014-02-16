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
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }
};

util.inherits(Generator, ScriptBase);

Generator.prototype.askForConstantValue = function askFor() {
  var cb = this.async();

  this.prompt([{  
    type: "input",
    name: "value",
    message: "Enter the value for the value '" + this.name + "' : "  
  }], function (props) {
    
    this.constant_value = props.value;

    if (typeof(this.constant_value) === 'string') {
    	this.constant_value = "'" + this.constant_value + "'";    	
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
    needle: '/* ---> Do not delete this comment (Values) <--- */',
    splicable: [
      "app.value('"+this.name+"', "+this.constant_value+");"
    ]
  };

  angularUtils.rewriteFile(config);
  console.log('Added Value :  '+ this.name);
};
