/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var fs = require("fs");
var router = express.Router();
var requestHelper = require('../helpers/requestHelper.js');
var http = require('http');
var qs = require("querystring");
var clientStateValueExpected = require('../constants').subscriptionConfiguration.clientState;
var mongoose = require("mongoose");
var db = require("../Handlers/dbHandler.js");
var client = require("../Handlers/client.js");
var notification = require("../Handlers/notification.js");
var connectionManager = require("../Handlers/ConnectionManager.js");
var signalr = require("signalrjs");
var signalR = signalr();

/* Default listen route */
router.post('/', function (req, res, next) {
    
    var status = 202;;
    var clientStatesValid;
    var i;
    var resource;
    var subscriptionId;
    
    if (req.query.validationToken) {
        
        status = 202;
        res.send(req.query.validationToken);
        res.status(200);
        
    } else {

        status = 202;
        
        // @note: anthing after res will not be executed .
        // res.status(202);
            clientStatesValid = false;
        
        //First, validate all the clientState values in array
        for (i = 0; i < req.body.value.length; i++) {
            if (req.body.value[i].clientState !== clientStateValueExpected) {
                // If just one clientState is invalid, we discard the whole batch
                clientStatesValid = false;
                break;
            } else {
                clientStatesValid = true;
            }
        }
        
        // validate all notifications 
        if (true) {
            // process all the notifications   
                        
            for (i = 0; i < req.body.value.length; i++) {
               resource = req.body.value[i].resource;
               subscriptionId = req.body.value[i].subscriptionId;
                res.status(202);
                res.end();
                if(req.body.value[i].changeType === "Created"){
                    console.dir("Notification Mail recieved . ");
                    processNotification(subscriptionId, resource, res, next);
                }else{
                    console.log("Ignore other notifications.");
                }
            }
            
            // Send a status of 'Accepted'
            status = 202;
            res.status(status);
        } else {
            
            // Dispose of unkown clientstate notifications 
            status = 202;
            res.status(status);
        }
        status = 202;
    }
    res.status(status).end(http.STATUS_CODES[status]);
});

function htmlParse(html){
    var endStr;
    
    return endStr;
}

function processNotification(subscriptionId, resource, res, next) {
    db.GetSubscription(requestHelper, qs, mongoose, subscriptionId, client, function (subscriptionData) {
        if (subscriptionData) {
            var email ,
            body;
                        
            requestHelper.getData(
                '/beta/' + resource, subscriptionData.accessToken,
                function (requestError, endpointData) {
                    console.log(endpointData);
                    if (endpointData) {
                        console.dir(endpointData);
                        // body = htmlParse(endpointData.value.);
                        db.StoreNotification(mongoose, endpointDat), notification);
                        connectionManager.sendNotification(signalR, null, 'email', 'body');
                        next();
                    } else if (requestError) {
                        res.status(202);
                        next(requestError);
                    }
                }
            );
           res.status(202);
        } else {
            res.status(500);
        }
    });
}


module.exports = router;
