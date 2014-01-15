
app.factory('<%= cameledName %>', ['<%= inject %>', function(<%= inject %>){

	// You can write some code here
<% if (options['api']) { %>
	return $resource("/xxx", {}, {

		getXXX:{
			method:'GET',
			params:{       
			}
		}
	});	
<% } else { %>

	return {
	    func : function() {
	      
	    }
	}
<% } %>
}]);
