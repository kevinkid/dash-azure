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
var notification = require("../Handlers/notifications.js");
var jsdom = require("jsdom");
var Striptags = require("striptags");

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
            
            for (i = 0; i < req.body.value.length; i++) {
                resource = req.body.value[i].resource;
                subscriptionId = req.body.value[i].subscriptionId;
                res.status(202);
                res.end();
                if (req.body.value[i].changeType === "created") {
                    console.dir("Incoming Mail Notificaiton  ");
                    processNotification(subscriptionId, resource, res, next);
                } else {
                    console.log("Ignored <" + req.body.value[i].changeType + ">");
                }
            }
            
            // Send a status of 'Accepted'
            status = 202;
            res.status(status);
        } else {
            
            status = 202;
            res.status(status);
        }
        status = 202;
    }
    res.status(status).end(http.STATUS_CODES[status]);
});

function htmlParse(html) {
    var endStr;
    endStr = Striptags(html).toString();
    endStr = endStr.replace(/\r/gmi, "");
    endStr = endStr.replace(/\n/gmi, "");
    endStr = endStr.replace(/&(.*);/gmi , "")
    return endStr;
}

function processNotification(subscriptionId, resource, res, next) {
    db.GetSubscription(requestHelper, qs, mongoose, subscriptionId, client, function (subscriptionData) {
        if (subscriptionData) {
            var email ,
                body;
            /**
                   * If token is expired .
                   * var now  = "04/09/2013 15:00:00";
                   * var then = "04/09/2013 14:20:30";
                   * moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                   */

                    // for some reason am creating subscriptions with expired tokens. maybe to time on aure and on my local machine are different.

            requestHelper.getData(
                '/beta/' + resource, subscriptionData.accessToken,
                function (requestError, endpointData) {
                    console.log(endpointData);
                    if (endpointData) {
                        if (endpointData !== null) {
                            
                            console.dir(endpointData);
                            // body = htmlParse(endpointData.value.);
                            email = endpointData.from.emailAddress.address;
                            body = endpointData.body.content;
                            body = htmlParse(body);
                            console.dir("Notification From:" + email + " : " + body);
                            connectionManager.sendNotification(jsdom, ((endpointData.hasAttachments) ? email + "@Att":email), body);
                            //db.StoreNotification(mongoose,qs.escape(JSON.stringify(endpointData)) ,client);
                            console.dir("Successful notification  ");
                        } else {
                            //@todo: Handle Unsubscribe notifications and refresh expired tokens .
                            console.dir("Subscription recognised by Dash");
                        }
                    } else if (requestError) {
                        console.dir(requestError);
                    }
                }
            );
        } else {
            console.dir("Ignore expired subscriptions ");
        }
    });
}


module.exports = router;
