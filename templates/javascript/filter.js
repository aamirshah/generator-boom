

app.filter('<%= cameledName %>', function () {
	return function (input) {

		console.log('Filter == <%= cameledName %>');
		
		return;
	};
});