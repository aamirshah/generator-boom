Boom Angular.js Generator!
=====================

---------------

This project is a Yeoman Generator, using which we can speed up our web app development. The command name is **$ yo boom**. Boom because its indeed a BOOM.

You can also check the [NPM Repository](https://npmjs.org/package/generator-boom) 


>Lets quick walk through the **boom** commands.And understand how quickly we can <i class="icon-cog"></i> `Setup` the entire project with a `boom`.

----------

What makes it cool
----------

 1. **Ultra Fast** - Uses Gulp instead of Grunt
 2. **Live Reload** pre-configured
 3. **Development** and **Production** code are separated
 4. **AngularUI** included (optional)
 5. **JS-HINT** pre-configured
 6. **FontFace** - Add [@fontface](https://github.com/aamirshah/generator-boom/blob/master/font/USAGE.md) on fly
 7. [Constants](https://github.com/aamirshah/generator-boom/blob/master/constant/USAGE.md) and [Values](https://github.com/aamirshah/generator-boom/blob/master/value/USAGE.md) will be added in main.js (No new file will be created)
 8. [Adding Routes](https://github.com/aamirshah/generator-boom/blob/master/route/USAGE.md) will also create and link the css and controller in their respective folders.
 9. [Adding Views](https://github.com/aamirshah/generator-boom/blob/master/view/USAGE.md) is also allowed
 10. [Adding Styles](https://github.com/aamirshah/generator-boom/blob/master/style/USAGE.md) is also allowed
 11. Use `gulp build`for dev mode and `gulp build:prod` for production.

<i class="icon-download"></i> Installation
---------

Install the Boom Generator first.

```sh
    npm install -g generator-boom
```

Make a new Directory for the project and cd into it

```sh
    mkdir my-new-project && cd $_
```

Then execute the boom command

```sh
    yo boom [app-name]
```

Answer few question on the command prompt and **Thats it!**

To install the dependency packages (Required **only if** you need to run the `npm install` as a **super user**)

```
    npm start
```

To start the server

```sh
    gulp
```

-----------



Dependency
--------

For Live Reload to work you need to install the Chrome Extension [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)



----------


> **NOTE:**
> 
> - You can easily get rid of any code/library you installed
> - You can easily add/remove libraries/modules in future

----------

<i class="icon-file"></i> App Structure
---------------
```
 - app/
    |- css/
        |- fonts.css
    |- fonts/
    |- images/
    |- js/
        |- controllers/
        |- directives/
        |- factories/
        |- filters/
        |- libs/
        |- providers/
        |- services/
        |- main.js
    |- templates/
    |- index.html
    |- bower.json
    |- package.json
    |- Gruntfile.js
    |- gulpfile.js
```

----------

<i class="icon-refresh"></i> Boom Commands
---------------

The avilable sub-generators are

* [boom:controller](https://github.com/aamirshah/generator-boom/blob/master/controller/USAGE.md)
* [boom:directive](https://github.com/aamirshah/generator-boom/blob/master/directive/USAGE.md)
* [boom:filter](https://github.com/aamirshah/generator-boom/blob/master/filter/USAGE.md)
* [boom:route](https://github.com/aamirshah/generator-boom/blob/master/route/USAGE.md)
* [boom:service](https://github.com/aamirshah/generator-boom/blob/master/service/USAGE.md)
* [boom:provider](https://github.com/aamirshah/generator-boom/blob/master/provider/USAGE.md)
* [boom:factory](https://github.com/aamirshah/generator-boom/blob/master/factory/USAGE.md)
* [boom:value](https://github.com/aamirshah/generator-boom/blob/master/value/USAGE.md)
* [boom:constant](https://github.com/aamirshah/generator-boom/blob/master/constant/USAGE.md)
* [boom:font](https://github.com/aamirshah/generator-boom/blob/master/font/USAGE.md)
* [boom:style](https://github.com/aamirshah/generator-boom/blob/master/style/USAGE.md)
* [boom:view](https://github.com/aamirshah/generator-boom/blob/master/view/USAGE.md)


<i class="icon-pencil"></i> Special Thanks
---------------

I would like to thank following for creating awesome stuff

* [AngularJS](http://angularjs.org) - MV* Framework for WebApps
* [Grunt](http://gruntjs.com) - A JavaScript task runner
* [Gulp](http://gulpjs.com/) - The streaming build system
* [Bower](http://bower.io) - Front End Package Manager
* [jQuery](http://jquery.com/) - DOM Manipulation Library
* [Yeoman](http://yeoman.io/) - Worlflow for modern WebApps
* [Generator](https://github.com/yeoman/generator-angular) - Yeoman Angular Generator

-------------------


License
---------------

The MIT License

Copyright (c) 2014 Aamir Shah (cse.aamir@gmail.com).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

