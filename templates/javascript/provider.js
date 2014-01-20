
/*================================================================
=>                   Provider = <%= cameledName %>
==================================================================*/
/*global app*/

app.provider('<%= cameledName %>', function () {

	'use strict';

<% if (!options['skip']) { %>
	this.name = 'Default';
 
    this.$get = function () {
	    var self = this;
	    return {
	        sayHello: function () {
	            return 'Hello, ' + self.name + '!';
	        }
	    };
	};
 
    this.setName = function (name) {
        this.name = name;
    };
<% } %>
});

<% if (!options['skip']) { %>
// app.config(function(<%= cameledName %>){
//     <%= cameledName %>.setName('Hello World');
// });
<% } %>


/*-----  End of Provider = <%= cameledName %>  ------*/