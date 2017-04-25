var https = require('https');
var Host = 'graph.microsoft.com';
var config = require('../api/config');
var PostPayload = config.accounts.office.subscriptionConfiguration;
var middleware = require('../middleware/request'); /* TODO: Make sure that this middleware handles the webook logic implementation  */
var AuthenticationContext = require('adal-node').AuthenticationContext;
var resource = 'https://graph.microsoft.com/';


var api = {

    generatePayload: function () {

    },

    handleRequest: function (payload) {
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
    },

    postData : function (path, token, data, callback) {
    ///NOTE: Handle the request using the handleRequest method above instead of repeating yourself .

        console.dir("Subscription post starting ");
        
        var ReqPayload = {};
        var options = {
            host: Host,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Length': data.length
            }
        };
        
        ReqPayload = PostPayload;
        ReqPayload.expirationDateTime = data.expirationDateTime;
        
        console.dir("payload constructed.");
        console.dir(data);
        
        console.dir("Token :");
        console.dir(token);
        
        var req = https.request(options, function (res) {
            var subscriptionData = '';
            res.on('data', function (chunk) {
                console.dir("Subscription responded .");
                subscriptionData += chunk;
                //'{\r\n  "error": {\r\n    "code": "InvalidRequest",\r\n    "message": "Subscription validation request failed. Must respond with 200 OK to this request.",\r\n    "innerError": {\r\n      "request-id": "aa09c28b-b8ce-4e42-96cf-9d5dcb9412a0",\r\n      "date": "2017-01-19T15:18:24"\
            });
            res.on('end', function () {
                console.dir("subscription request ended .");
                if (res.statusCode === 201) {
                    console.dir("Success subscription ");
                    callback(null, JSON.parse(subscriptionData));
                } else {
                    console.dir("Failure subscription .");
                    console.dir(JSON.parse(subscriptionData));
                    callback(JSON.parse(subscriptionData), null);
                }
            });
        });
        
        var date = JSON.parse(data).expirationDateTime;
        
        console.dir("date is:");
        console.dir(date);
        
        // Serve payload 
        // req.write("{\r\n  \"changeType\": \"Created\",\r\n  \"notificationUrl\": \"https://dash-heroku.heroku.com/listen\",\r\n  \"resource\": \"me/mailFolders('Inbox')messages\",\r\n  \"clientState\": \"cLIENTsTATEfORvALIDATION\",\r\n  \"expirationDateTime\":\""+date+"\"\r\n}");
        req.write(data);
        req.end();
        
        req.on('error', function (error) {
            callback(error, null);
        });
    },


    getData : function (path, token, callback) {
    ///NOTE: Handle the request using the handleRequest method above instead of repeating yourself .
        var options = {
            host: Host,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json;odata.metadata=minimal;' +
                        'odata.streaming=true;IEEE754Compatible=false',
                Authorization: 'Bearer ' + token
            }
        };
        
        var req = https.request(options, function (res) {
            var endpointData = '';
            res.on('data', function (chunk) {
                endpointData += chunk;
            });
            res.on('end', function () {
                if (res.statusCode === 200) {
                    callback(null, JSON.parse(endpointData));
                } else {
                    callback(JSON.parse(endpointData), null);
                }
            });
        });
        
        req.write('');
        req.end();
        
        req.on('error', function (error) {
            callback(error, null);
        });
    },



    deleteData : function (path, token, callback) {
    ///NOTE: Handle the request using the handleRequest method above instead of repeating yourself .
        var options = {
            host: Host,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'X-HTTP-Method': 'DELETE',
                Authorization: 'Bearer ' + token
            }
        };
        
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

};


exports.api = api;
