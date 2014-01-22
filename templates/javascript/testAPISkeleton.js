const REQUEST_DOMAIN = '';

var request = require('supertest')(REQUEST_DOMAIN);




/*====================================================
=>                  Define your test                 
====================================================*/


describe('', function(){
	it('', function(done) { 
		request.get('/')
		.expect(200)
		.end(function(err, res){
			console.log('Success = ', res);
			// console.log('Error = ', err);
		});	    
	});
});

