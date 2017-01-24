/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/authHelper.js');
var dbHelper = new (require('../helpers/dbHelper'))();
var requestHelper = require('../helpers/requestHelper.js');
var subscriptionConfiguration = require('../constants').subscriptionConfiguration;
var https = require("https");


/* Redirect to start page */
router.get('/', function (req, res) {
 
    console.dir("Not Found code in query param .");
    res.redirect('/index.html');

});

/* Start authentication flow */
router.get('/signin', function (req, res) {
  res.redirect(authHelper.getAuthUrl());
});

// This route gets called at the end of the authentication flow.
// It requests the subscription from Office 365, stores the subscription in a database,
// and redirects the browser to the dashboard.html page.
router.get('/callback', function (req, res) {
 console.dir("Checking for code query param .");
    console.dir("Found code in query param .");

      var subscriptionId;
      var subscriptionExpirationDateTime;
      authHelper.getTokenFromCode(req.query.code, function (authenticationError, token) {
        if (token) {
          console.dir("Got token !");
          console.dir(token);
          // Request this subscription to expire one day from now.
          // Note: 1 day = 86400000 milliseconds
          // The name of the property coming from the service might change from
          // subscriptionExpirationDateTime to expirationDateTime in the near future.
 
          subscriptionExpirationDateTime = new Date(Date.now() + 86400000).toISOString();//ISO time format 
          subscriptionConfiguration.expirationDateTime = subscriptionExpirationDateTime;
          // Make the request to subscription service.
          requestHelper.postData(
            '/beta/subscriptions',
            token.accessToken,
            JSON.stringify(subscriptionConfiguration),
            function (requestError, subscriptionData) {
              if (subscriptionData !== null ) {
                subscriptionData.userId = token.userId;
                subscriptionData.accessToken = token.accessToken;
                // dbHelper.saveSubscription(subscriptionData, null);// @todo: Save subscription details 

                // The name of the property coming from the service might change from
                // subscriptionId to id in the near future.
                subscriptionId = subscriptionData.id;
                res.redirect(
                  '/dashboard.html?subscriptionId=' + subscriptionId +
                  '&userId=' + subscriptionData.userId
                );
              } else if (requestError) {
                res.status(500);
              }
            }
          );

        } else if (authenticationError) {
          res.status(500);
        }
      });

});

// This route signs out the users by performing these tasks
// Delete the subscription data from the database
// Redirect the browser to the logout endpoint.
router.get('/signout/:subscriptionId', function (req, res) {
  var redirectUri = req.protocol + '://' + req.hostname + ':' + req.app.settings.port;

  // Delete the subscription from Microsoft Graph
  dbHelper.getSubscription(req.params.subscriptionId, function (dbError, subscriptionData, next) {
    if (subscriptionData) {
      requestHelper.deleteData(
        '/beta/subscriptions/' + req.params.subscriptionId,
        subscriptionData.accessToken,
        function (error) {
          if (!error) {
            dbHelper.deleteSubscription(req.params.subscriptionId, null);
          }
        }
      );
    } else if (dbError) {
      res.status(500);
    }
  });

  res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + redirectUri);
});

module.exports = router;
