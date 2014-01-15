'use strict';
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  angularUtils = require('../util.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
  this.hookFor('boom:controller');
  this.hookFor('boom:view');
};

util.inherits(Generator, ScriptBase);

Generator.prototype.rewriteAppJs = function () {
  var coffee = this.env.options.coffee;
  var config = {
    file: path.join(
      this.env.options.appPath,
      'js/main.' + (coffee ? 'coffee' : 'js')
    ),
    needle: '.otherwise',
    splicable: [
      "\t\t\ttemplateUrl: 'templates/" + this.name.toLowerCase() + ".html'"
      // ,"  controller: '" + this.classedName + "Ctrl'"
    ]
  };

  if (coffee) {
    config.splicable.unshift("\t\t.when '/" + this.name + "',");
  }
  else {
    config.splicable.unshift("\t\t.when('/" + this.name + "', {");
    config.splicable.push("\t\t})");
  }

  angularUtils.rewriteFile(config);
};
