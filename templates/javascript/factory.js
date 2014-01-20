
/*================================================================
=>                   Factory = <%= cameledName %>
==================================================================*/
/*global app*/

app.factory('<%= cameledName %>', ['<%= inject %>', function (<%= inject %>) {

	'use strict';

	// You can write some code here
<% if (options['api']) { %>
	return $resource('/xxx', {}, {

		getXXX: {
			method: 'GET',
			params: {
			}
		}
	});
<% } else { %>

	return {
	    func : function () {
	      
	    }
	};
<% } %>
}]);


/*-----  End of Factory = <%= cameledName %>  ------*/