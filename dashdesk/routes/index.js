// Routes Definition 
var express = require("express");
var router = express.Router();
var authContext = require("adal-node").AuthenticationContext;
var authHelper = require('../helpers/authHelper.js');
var requestHelper = require("../helpers/requestHelper.js");
var subscriptionConfiguration = require("../constants").subscriptionConfiguration;
var https = require("https");




router.get('/', function (req, res) {
    res.redirect("/index.html");
});

//  Microsoft signin route 
router.get('/signin', function (req, res) {
    res.redirect(authHelper.getAuthUrl());
});


router.post('/', function (req, res) {
   
    if (req.query.validationToken) {
        
    } else {
    
    }
         
});

router.get('/callback', function (req, res) {
    console.dir("Checking for code query param .");
    console.dir("Found code in query param .");
    
    var subscriptionId;
    var subscriptionExpirationDateTime;
    authHelper.getTokenFromCode(req.query.code, function (authenticationError, token) {
        if (token) {
            console.dir("Got token !");
            console.dir(token);
            
            // Expiration date 86400000 [ms]
            
            subscriptionExpirationDateTime = new Date(Date.now() + 86400000).toISOString();//ISO time format 
            subscriptionConfiguration.expirationDateTime = subscriptionExpirationDateTime;
            // Make the request to subscription service.
            requestHelper.postData(
                '/v1.0/subscriptions',
            token.accessToken,
            JSON.stringify(subscriptionConfiguration),
            function (requestError, subscriptionData) {
                    if (subscriptionData !== null) {
                        subscriptionData.userId = token.userId;
                        subscriptionData.accessToken = token.accessToken;
                                                                           
                        // store subscription data 
                         //require("../Handlers/dbHandler.js")(mongoose, req.body.value,"storeUser");

                        subscriptionId = subscriptionData.id;
                        res.redirect(
                            '/dashboard.html?subscriptionId=' + subscriptionId +
                  '&userId=' + subscriptionData.userId + 'subObject={' + JSON.stringify(subscriptionData) + '}'
                        );
                    } else if (requestError) {
                        // @todo: remote this bad error response only for development.
                        res.redirect("/index.html?Error=" + JSON.stringify(requestError));
                        //console.dir(requestError);
                        //res.json(requestError);
                        //res.status(500);
                    }
                }
            );
        } else if (authenticationError) {
            res.status(500);
        }
    });
});



// @todo: Use this route when signalr detects that a connection has been lost for a long time,
// @todo: Define long time programmatically 
router.get("/signout/:subscriptionId", function (req, res) {
    var redirectUri = req.protocal + "://" + req.hostname + ":" + req.app.settings.port;
    
    if (req.params.subscriptionId) {
        requestHelper.deleteData(
            '/v1.0/subscriptons/' + req.params.subscriptonId,
            function (err) {
                if (!err) {
                    //@todo: Remove from the database 
                    //dbHelper.deleteSubscription(req.params.subscriptionId, null);
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
