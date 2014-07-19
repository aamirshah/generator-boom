// i. Download chromedriver - http://chromedriver.storage.googleapis.com/index.html
// ii. Install protractor as a global npm module
// iii. mv chromedriver /usr/local/bin/
// $ protractor tests/e2e/sampleTest.js

'use strict';

var fs = require('fs'),
    allTests = fs.readdirSync('./tests/api/');

for (var i = 0; i < allTests.length; i++) {
    allTests[i] = 'api/' + allTests[i];
}

// An example configuration file.
exports.config = {
    // Do not start a Selenium Standalone sever - only run this using chrome.
    chromeOnly: true,
    chromeDriver: '/usr/local/bin/chromedriver',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the current working directly when protractor is called.
    specs: allTests,

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
