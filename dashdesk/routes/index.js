// Routes Definition 
var express = require("express");
var router = express.Router();
var authContext = require("adal-node").AuthenticationContext;
var authHelper = require('../api/auth.js');
var api = require("../api/api.js");
var subscriptionConfiguration = require("../api/config").accounts.office.subscriptionConfiguration;
var https = require("https");
var qs = require("querystring");
var mongoose = require("mongoose");
var client = require("../Handlers/client.js");
var db = require("../Helpers/dbHelper.js");
var subscription = {};
var accountsFactory = require("../Handlers/AccountsFactory.js"); //@Todo : Use the account manager instead .


router.get('/', function (req, res) {
    res.redirect("/index.html");
});

///  Microsoft signin route 
router.get('/signin', function (req, res) {
    res.redirect(accountsFactory.getAuthUrl());
});


/// Install a client route 
router.get('/callback', function (req, res) {
    console.dir("Checking for code query param .");
    console.dir("Found code in query param .");

    //TODO: Handle different account authentication from here 
    //TODO: Also handle pre-exsisting accounts from here .
    //TODO: To verify the account of people find a way to keep
    // the email provided in cookies then embed it in the callback
    var exist = accountsFactory.verifyAccount(req.query.email);
    
    if (!exist) {

    } else {
        // TODO: Get the subscription id for the account 
        subscriptionId = subscriptionData.id;
        res.redirect(
            '/dashboard.html?subscriptionId=' + subscriptionId +
        '&userId=' + subscriptionData.userId + 'subObject={' + JSON.stringify(subscriptionData) + '}'
        );
    }

    var subscriptionId;
    var subscriptionExpirationDateTime;
    authHelper.getTokenFromCode(req.query.code, function (authenticationError, token) {
        if (token) {
            
            // Expiration date 86400000 [ms] -eq 24hr 
            subscriptionExpirationDateTime = new Date(Date.now() + 86400000).toISOString();//ISO time format 
            subscriptionConfiguration.expirationDateTime = subscriptionExpirationDateTime;
            
            api.postData(
                '/v1.0/subscriptions',
            token.accessToken,
            JSON.stringify(subscriptionConfiguration),
            function (requestError, subscriptionData) {
                    if (subscriptionData !== null) {
                        subscriptionData.userId = token.userId;
                        subscriptionData.accessToken = token.accessToken;
                        
                        db.InstallClient(mongoose, qs.escape(JSON.stringify(subscriptionData)), subscriptionData.id, token, client, function (error) {
                            if (error) {
                                subscriptionId = subscriptionData.id;
                                res.redirect(
                                    '/dashboard.html?dbError=' + error + '&subscriptionId=' + subscriptionId +
                                '&userId=' + subscriptionData.userId + 'subObject={' + JSON.stringify(subscriptionData) + '}'
                                );
                            } else {
                                subscriptionId = subscriptionData.id;
                                res.redirect(
                                    '/dashboard.html?subscriptionId=' + subscriptionId +
                                '&userId=' + subscriptionData.userId + 'subObject={' + JSON.stringify(subscriptionData) + '}'
                                );
                            }
                        });
                       
                    } else if (requestError) {
                        res.redirect("/index.html?Error=" + JSON.stringify(requestError));
                    }
                }
            );
        } else if (authenticationError) {
            res.status(500);
        }
    });
});




/// Uninstalling an application using this route .
router.get("/signout/:subscriptionId", function (req, res) {
    var redirectUri = req.protocal + "://" + req.hostname + ":" + req.app.settings.port;
    if (req.params.subscriptionId) {
        api.deleteData(
            '/v1.0/subscriptons/' + req.params.subscriptonId,
            function (err) {
                if (!err) {
                    // @todo: Handle uninstalling of clients    
                    console.dir("Removing subscription from the databse .");
                }
            }
        );
    } else if (dbError) {
        res.status(500);
    }
    res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + redirectUri);
});




module.exports = router;
