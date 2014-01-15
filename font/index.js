'use strict';
var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman-generator'),
  ScriptBase = require('../script-base.js'),
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

// util.inherits(Generator, yeoman.generators.NamedBase);
util.inherits(Generator, ScriptBase);

Generator.prototype.createViewFiles = function createViewFiles() {
  
  var config = {
    file: path.join(
      this.env.options.appPath,
      'css/fonts.css'
    ),
    needle: '/* ---> Do not delete this comment <--- */',
    splicable: [
      "\n@font-face { \n" +
        "\tfont-family: '" + this.name + "'; \n" +
        "\tsrc: url('../fonts/" + this.name + "/" + this.name + ".eot'); /* IE9 Compat Modes */ \n" +
        "\tsrc: url('../fonts/" + this.name + "/" + this.name + ".eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */ \n" +
          "\t\turl('../fonts/" + this.name + "/" + this.name + ".woff') format('woff'), /* Modern Browsers */ \n" +
          "\t\turl('../fonts/" + this.name + "/" + this.name + ".ttf')  format('truetype'), /* Safari, Android, iOS */ \n" +
          "\t\turl('../fonts/" + this.name + "/" + this.name + ".svg#svgFontName') format('svg'); /* Legacy iOS */ \n" +
      "}"
    ]
  };

  this.mkdir('app/fonts/'+this.name);
  angularUtils.rewriteFile(config);

  console.log('Added font '+ this.name);
};

