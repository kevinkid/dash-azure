var https = require('https');
var Host = 'graph.microsoft.com';
var config = require('../api/config');
var PostPayload = config.accounts.outlook.subscriptionConfiguration;


// Main logic 
var req = https.request(options, function (res) {
    var endpointData = '';
    res.on('data', function (chunk) {
        endpointData += chunk;
    });
    res.on('end', function () {
        callback(null);
    });
});

req.end();

req.on('error', function (error) {
    callback(error);
});
