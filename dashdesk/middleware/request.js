var https = require('https');
var Host = 'graph.microsoft.com';
var config = require('../api/config');



function handleRequest () {
    var options = {
        host: Host,
        path: path,
        method: payload.action,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Length': data.length
        }
    };
    
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

}
