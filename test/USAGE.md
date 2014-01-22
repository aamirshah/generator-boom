Installing Protractor
-----------

 1. Download chromedriver - http://chromedriver.storage.googleapis.com/index.html
 2. Install protractor as a global npm module `npm install -g protractor`
 3. Move the chrome driver to your PATH `mv chromedriver /usr/local/bin/`
 4. Run the tests `protractor tests/e2e/all_e2e.js`


Tests
============
We can create E2E tests on fly. But before that we need to setup the protractor as mentioned above.

Command Usage
-------


***Example***

```
   $ yo boom:test test_name
```

This will create

```
    tests/e2e/test_name.js
```


To create an API test use 

```
    yo boom:test test_name -api
```

This will create 

```
    tests/api/test_name.js
```

To run all the E2E tests use 

```
    protractor tests/all_e2e.js
```

Similarly to rum all API tests use 

```
    protractor tests/all_api.js
```
