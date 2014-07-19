'use strict';

const REQUEST_DOMAIN = '';

var request = require('supertest')(REQUEST_DOMAIN);

/*====================================================
=>                  Define your test                 
====================================================*/

describe('', function (){
    it('', function (done) { 
        request.get('/')
        .expect(200)
        .end(function (error, response){
            console.log('Success = ', response);
        });     
    });
});
