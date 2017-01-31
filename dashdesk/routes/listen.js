/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var fs = require("fs");
var router = express.Router();
var requestHelper = require('../helpers/requestHelper.js');
var http = require('http');
var signalR = require("signalr-client");
var clientStateValueExpected = require('../constants').subscriptionConfiguration.clientState;
var mongoose = require("mongoose");
var client = require("../Handlers/client.js");
var subscription = require("../Handlers/subscription.js");
var db = require("../Handlers/dbHandler.js");


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
        if (clientStatesValid) {
            // process all the notifications   

            resource = req.body.value[0].resource;
            subscriptionId = req.body.value[0].subscriptionId;
            processNotification(subscriptionId, resource, res, next);

            // @note: uncomment for multiple notifications, very smart way of handling notifications just send them altogether together .
            for (i = 0; i < req.body.value.length; i++) {
               resource = req.body.value[i].resource;
               subscriptionId = req.body.value[i].subscriptionId;
               processNotification(subscriptionId, resource, res, next);
            }// This was uncommented .
            
            // Send a status of 'Accepted'
            status = 202;
        } else {
            
           // Dispose of unkown clientstate notifications 
            status = 202;
        }
    }
    res.status(status).end(http.STATUS_CODES[status]);
});



function processNotification(subscriptionId, resource, res, next) {
        
    db.GetSubscription(mongoose, subscriptionId,client, function(subscriptionData){

        if (subscriptionData) {
            requestHelper.getData(
                '/beta/' + resource, subscriptionData.accessToken,
                function (requestError, endpointData) {
                    if (endpointData) {

                        //@todo:  Send notification to client 
                        console.dir(endpointData);

                    } else if (requestError) {

                        res.status(500);
                        next(requestError);

                    }
                }
            );
        } else if (dbError) {
            res.status(500);
        }
    });
}


module.exports = router;
