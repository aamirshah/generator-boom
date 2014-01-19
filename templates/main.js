/*================================================================
=>                  App = <%= scriptAppName %>
==================================================================*/

var app = angular.module('<%= scriptAppName %>', [<%= angularModules %>]);

<% if (ngRoute) { %>
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	'use strict';

	$routeProvider
		.when("/home", {
			templateUrl:"templates/home.html"
		})
		.otherwise({
			redirectTo:'/home'
		});

	$locationProvider.hashPrefix('!');
}]);
<% } %>




/*================================================================
=>                  <%= scriptAppName %> App Run()  
==================================================================*/

app.run(['$rootScope', function($rootScope){
	
	'use strict';

	console.log("Angular.js run() function...");
}]);




/* ---> Do not delete this comment (Values)<--- */

/* ---> Do not delete this comment (Constants)<--- */