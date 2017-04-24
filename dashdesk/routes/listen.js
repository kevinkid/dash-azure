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
var db = require("../Helpers/dbHelper.js");
var client = require("../Handlers/client.js");
var connectionManager = require("../Handlers/ConnectionManager.js");
var notification = require("../Handlers/notifications.js");
var jsdom = require("jsdom-no-contextify");
var moment = require('moment');

/* Default listen route */
router.post('/', function (req, res, next) {
    
    var status = 202;;
    var clientStatesValid;
    var i;
    var resource;
    var subscriptionId;
    
    if (req.query.validationToken) {

        res.send(req.query.validationToken);
        res.status(200);
        res.end();
        
    } else {
        
        status = 202;

        // Process notifications 
        for (i = 0; i < req.body.value.length; i++) {
            resource = req.body.value[i].resource;
            subscriptionId = req.body.value[i].subscriptionId;
            res.status(202);
            res.end();

            if ((req.body.value[i].changeType === "created" ||
                req.body.value[i].changeType === "updated") &&
            req.body.value[i].clientState !== clientStateValueExpected) {
                
                processNotification(subscriptionId, resource, res, next);

            }
        }
        
        // Send a status of 'Accepted'
        status = 202;
        res.status(status);

    }
    res.status(status).end(http.STATUS_CODES[status]);
});




/**
 * @desc - Determines if the current date is past the input expiry date .
 * @param {string} - Expiry date 
 * @return {bool} - boolean value 
 */
function CredViablitityCheck(ExpiryDateTime) {
    return ((moment(ExpiryDateTime).toNow()).search('ago') < 0) ? true : false ;
}



/**
 * @param {string} - subscriptionid identify a user 
 * @param {string} - resource containing deeper notification jquery 
 * @param {Object} - Node responce object 
 */
function processNotification(subscriptionId, resource, res) {
    db.GetSubscription(requestHelper, qs, mongoose, subscriptionId, client, function (subscriptionData) {
        if (subscriptionData) {
            
                if(CredViablitityCheck()){

                    requestHelper.getData(
                        '/beta/' + resource, subscriptionData.accessToken,
                        function (requestError, endpointData) {
                            console.log(endpointData);
                            if (endpointData) {
                                if (endpointData !== null) {
                    
                                    console.dir("Notification From:" + email + " : " + body);

                                    connectionManager.sendNotification(jsdom,
                                                                        ((endpointData.hasAttachments) ? (endpointData.from.emailAddress.address) + "@Att":endpointData.from.emailAddress.address),
                                                                        qs.escape(endpointData.body.content));
                                //db.StoreNotification(mongoose,qs.escape(JSON.stringify(endpointData)) ,client);
                                                                
                                    console.dir("Notification sent Successfully  ");
                                } else {

                                    //@todo: Handle Unsubscribe notifications and refresh expired tokens .
                                    console.dir("Subscription recognised by Dash");

                                }
                            } else if (requestError) {
                                console.dir(requestError);
                            }
                        });

                }else {
                    //@Todo: Use the referesh token to reset the credentails
                    requestHelper.getTokenFromRefreshToken(endpointData.refreshToken, function(error, token){
                        if(!error){
                            db.StoreNotification(mongoose,qs.escape(JSON.stringify(endpointData)) ,client);
                                          
                                requestHelper.getData(
                                '/beta/' + resource, subscriptionData.accessToken,
                                function (requestError, endpointData) {
                                    console.log(endpointData);
                                    if (endpointData) {
                                        if (endpointData !== null) {
                      
                                            console.dir("Notification From:" + email + " : " + body);

                                            connectionManager.sendNotification(jsdom,
                                                     ((endpointData.hasAttachments) ? (endpointData.from.emailAddress.address) + "@Att@": (endpointData.from.emailAddress.address)),
                                                    qs.escape( endpointData.body.content));
                                            //db.StoreNotification(mongoose,qs.escape(JSON.stringify(endpointData)) ,client);

                                            console.dir("Notification sent Successfully  ");
                                        } else {
                                            //@todo: Handle Unsubscribe notifications and refresh expired tokens .
                                            console.dir("Subscription recognised by Dash");
                                        }
                                    } else if (requestError) {
                                        console.dir(requestError);
                                    }
                                });
                        }else {
                            ///@Todo : Try implementing a retry for new accesstoken credentails
                        }
                    });
            }
        } else {
            console.dir("Ignore expired subscriptions ");
        }
    });
}


module.exports = router;
