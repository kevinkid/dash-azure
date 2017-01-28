/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var fs = require("fs");
var router = express.Router();
var io = require('../helpers/socketHelper.js');
var requestHelper = require('../helpers/requestHelper.js');
var http = require('http');
var signalR = require("../app.js").signalR;
var clientStateValueExpected = require('../constants').subscriptionConfiguration.clientState;
var mongoose = require("mongoose");
var notification = require("../Handlers/client.js");
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
        res.status(202);
        
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
               processNotification(subscriptionId, resource, res, next);//todo: uncomment me 
            }
            
            // Send a status of 'Accepted'
            status = 202;
        } else {
            
            //@todo: Write data to file for debuging, i couldn't get remote debuging for visual studio to work .
            fs.writeFile('./log.txt', 'client state not valid notification from Microsoft endpoint webhook',
                    {
                encoding: "utf8",
                mode: "0o666",
                flag: "w"
            }, function () {
                console.dir("App loging");
            });
            // Since the clientState field doesn't have the expected value,
            // this request might NOT come from Microsoft Graph.
            // However, you should still return the same status that you'd
            // return to Microsoft Graph to not alert possible impostors
            // that you have discovered them.
            status = 202;
        }
    }
    res.status(status).end(http.STATUS_CODES[status]);
});

// Get subscription data from the database
// Retrieve the actual mail message data from Office 365.
// Send the message data to the socket.
function processNotification(subscriptionId, resource, res, next) {
 dbHelper.getSubscription(subscriptionId, function (dbError, subscriptionData) {
   if (subscriptionData) {
     requestHelper.getData(
       '/beta/' + resource, subscriptionData.accessToken,
       function (requestError, endpointData) {
         if (endpointData) {
           io.to(subscriptionId).emit('notification_received', endpointData);
         } else if (requestError) {
           res.status(500);
           next(requestError);
         }
       }
     );
   } else if (dbError) {
     res.status(500);
     next(dbError);
   }
 });
}


// [mine]
function processNotification(subscriptionId, resource, res, next) {
    db.FindClient(mongoose, subscriptionId,client, )
   if (subscriptionId) {
       console.dir("Yey ! subscription id: " + subscriptionId);
       requestHelper.getData(
           '/beta/' + resource, subscriptionData.accessToken,
           function (requestError, endpointData) {
               if (endpointData) {

                   //@todo: Write data to file for debuging, i couldn't get remote debuging for visual studio to work .
                   fs.writeFile('./log.txt', endpointData,
                   {
                       encoding: "utf8",
                       mode: "0o666",
                       flag: "w"
                   }, function () {
                       console.dir("App loging");
                   });

                   //@todo: replace with signalr socket handler implementation logic 
                   io.to(subscriptionId).emit('notification_received', endpointData);
               } else if (requestError) {

                   //@todo: Write data to file for debuging, i couldn't get remote debuging for visual studio to work .
                   fs.writeFile('./log.txt', requestError,
                   {
                       encoding: "utf8",
                       mode: "0o666",
                       flag: "w"
                   }, function () {
                       console.dir("App loging");
                   });
                   res.status(500);
                   next(requestError);
               }
           }
       );
   } else if (dbError) {
       res.status(500);
   }
}

module.exports = router;
