"use strict";

var app = angular.module('<%= scriptAppName %>', [<%= angularModules %>]);

<% if (ngRoute) { %>
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	
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
app.run(['$rootScope', function($rootScope){

	console.log("Angular.js run() function...");
}]);


/* ---> Do not delete this comment (Values)<--- */

/* ---> Do not delete this comment (Constants)<--- */