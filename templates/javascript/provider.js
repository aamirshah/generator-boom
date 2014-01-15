
app.provider('<%= cameledName %>', function(){	
<% if (!options['skip']) { %>
	this.name = 'Default';
 
    this.$get = function() {
	    var self = this;
	    return {
	        sayHello: function() {
	            return "Hello, " + self.name + "!"
	        }
	    }
	};
 
    this.setName = function(name) {
        this.name = name;
    };
<% } %>
});

<% if (!options['skip']) { %>
// app.config(function(<%= cameledName %>){
//     <%= cameledName %>.setName('Hellow World');
// });
<% } %>