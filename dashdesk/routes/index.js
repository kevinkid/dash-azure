// Routes Definition 

var express = require("express");
var router = express.Router();
var authContext = require("adal-node").AuthenticationContext;
var authHelper = require('../helpers/authHelper.js');
//var dbHelper = require("../helpers/dbHelper");
var requrestHelper = require("../helpers/requestHelper.js");
var subscriptionConfiguration = require("../constants").subscriptionConfiguration;
var https = require("https");



exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};


//======================

router.get('/', function (req, res) {
    
    res.redirect("/index.html");
     
});

//  Microsoft signin route 
router.get('/signin', function (req, res) {
    res.redirect(authHelper.getAuthUrl());
});

router.get("/callback", function (req, res) {
    
    console.dir("Checking for code query param");
    
    console.dir("Found code in query param .");
    
    var subscriptionId;
    var subscriptionExpirationDateTime;
    authHelper.getTokenFromCode(req.query.code, function (authenticationError, token) {
        
        if (token) {
            console.dir("Got token !");
            console.dir(token);
            // token expiry date 86400000[ms]
            
            subscriptionExpirationDateTime = new Date(Date.now() + 86400000).toString(2);// ISO DateTime formate use to string method 
            subscriptionConfiguration.expirationDateTime = subscriptionExpirationDateTime;
            
            // Make request 
            requrestHelper.postData(
                '/beta/subscription',
                token.accessToken,
                JSON.stringify(subscriptionConfiguration),
                function (requestError, subscriptionData) {
                    
                    if (subscriptionData != null) {
                        
                        subscriptionId = subscriptionData.id;
                        res.redirect((
                        '/dashboard.html?subscription=' + subscriptionId +
                        '&userId=' + subscriptionData.userId));
                    } else if (requestError) {
                        req.status(500);

                    }
                });

        } else if (authenticationError) {
            res.status(500);
        }
    });
    
});



// sign out route 
// TODO: Remove this route 
//router.get("/signout/:subscriptionId", function (req, res) {
//    var redirectUri = req.protocal + "://" + req.hostname + ":" + req.app.settings.port;
    
//    dbHelper.getSubscription(req.params.subscriptionId, function (dbError, subscriptionData, next) {
        
//        if (subscriptionData) {
//            requrestHelper.deleteData(
//                '/beta.subscriptons/' + req.params.subscriptonId,
//                function (err) {
//                    if (!err) {
//                        dbHelper.deleteSubscription(req.params.subscriptionId, null);
//                    }
//                }
//            );
//        } else if (dbError) {
//            res.status(500);
//        }
//        res.status(500);
         
//    });
//    res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + redirectUri);

//});

// TODO: Remove this route 



module.exports = router;
