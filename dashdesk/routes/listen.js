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
var connectionManager = require("../Handlers/ConnectionManager.js");
var signalr = require("signalrjs");
var signalR = signalr();

/* Default listen route */
router.post('/', function (req, res, next) {
    
    var status;
    var clientStatesValid;
    var i;
    var resource;
    var subscriptionId;
    
    if (req.query.validationToken) {
        
        res.send(req.query.validationToken);
        res.status(200);
        
    } else {
        
        
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
            
            resource = req.body.value[0].resource;
            subscriptionId = req.body.value[0].subscriptionId;
            processNotification(subscriptionId, resource, res, next);
            res.status(202);
            
            for (i = 0; i < req.body.value.length; i++) {
               resource = req.body.value[i].resource;
               subscriptionId = req.body.value[i].subscriptionId;
                res.status(202);
               //processNotification(subscriptionId, resource, res, next);
            }
            
            // Send a status of 'Accepted'
            
        } else {
            
            // Dispose of unkown clientstate notifications 
            status = 202;
            res.status(status);
        }
    }
    res.status(status).end(http.STATUS_CODES[status]);
});



function processNotification(subscriptionId, resource, res, next) {
    db.GetSubscription(qs, mongoose, subscriptionId, client, function (subscriptionData) {
        if (subscriptionData) {
            requestHelper.getData(
                '/beta/' + resource, subscriptionData.accessToken,
                function (requestError, endpointData) {
                    console.log(endpointData);
                    if (endpointData) {
                        console.dir(endpointData);
                        db.StoreNotification(mongoose, qs.escape(JSON.stringify(endpointData).clientDetails[0]), notification);
                        connectionManager.sendNotification(signalR, null, JSON.stringify(endpointData));
                        next();
                    } else if (requestError) {
                        res.status(202);
                        next(requestError);
                    }
                }
            );
        } else {
            res.status(202);
        }
    });
}


module.exports = router;
