
app.directive('<%= cameledName %>', ['$rootScope', function ($rootScope) {
   
	return {
	  restrict: 'A',
	  link: function(scope, element, attrs) {
	  	console.log('Directive === <%= cameledName %>');
	  }
	};
}]);
