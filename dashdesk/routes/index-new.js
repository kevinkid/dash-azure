// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var express = require('express');
var router = express.Router();
var authContext = require('adal-node').AuthenticationContext;
// var $ = require('jQuery'); // jquery is dependent on another package 
var request = require('ajax-request');
// var offline = require('offline-js');
var authHelper = require('../authHelper.js');
var requestUtil = require('../requestUtil.js')
var emailer = require('../emailer.js');
var app = require('../app.js');
// new app url : http://yofit.azurewebsites.net/login ...
// source control deployment credentials |PASS : Yofit-app | USER-NAME : kevinkid-yofitapp  

                  

/* GET home page. */
router.get('/', function (req, res, next) {

try{

    var code = req.query.code;
    console.log("code is "+code);
    if (code !== undefined) {
      authHelper.getTokenFromCode('https://graph.microsoft.com/', req.query.code, function (token) {
        if (token !== null) {
          console.log("Success getting access token .");
          console.dir(token);//@Note: token is an object maybe or there are more args

          console.log("Requesting subscription .");
          requestSubscription(req,, res, restoken.accessToken);
    
        }
        else {
          console.log("AuthHelper failed to acquire token");  
          res.status(500);
          res.send();
        }
      });
    }else {
        res.redirect('login');
    }

}catch(e){

  if (req.cookies.TOKEN_CACHE_KEY === undefined){
    res.redirect('login');
  }
  else {
    renderSendMail("me", req, res);
  }

}

});  // routes plain  / 




router.get('/disconnect', function (req, res, next) {
  //check for token
  req.session.destroy();
  res.clearCookie('nodecookie');
  res.clearCookie(authHelper.TENANT_CACHE_KEY);
  res.clearCookie(authHelper.TOKEN_CACHE_KEY);
  res.status(200);
  // var redirectUri = 'http://' + req.hostname + ':' + app.port;
  var redirectUri = 'http://yofit.azurewebsites.net/login'; // this works not like the other one 
  console.log('Disconnect redirect uri: ' + redirectUri);
  res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + redirectUri);
}); // routes /disconnect 

/* GET home page. */
router.get('/login', function (req, res, next) {
  if (req.query.code !== undefined) {
    authHelper.getTokenFromCode('https://graph.microsoft.com/', req.query.code, function (token) {
      if (token !== null) {
        //cache the refresh token in a cookie and go back to index
        res.cookie(authHelper.TOKEN_CACHE_KEY, token.refreshToken);
        res.cookie(authHelper.TENANT_CACHE_KEY, token.tenantId);
        requestSubscription(token.accessToken);
        renderSendMail("me", req, res);
      }
      else {
        console.log("AuthHelper failed to acquire token");  
        res.status(500);
        res.send();
      }
    });
  }
  else {
    res.render('login', { auth_url: authHelper.getAuthUrl() });
  }
}); // router /login 

     

     

function renderSendMail(path, req, res) {
  wrapRequestAsCallback(req.cookies.TOKEN_CACHE_KEY, {

    onSuccess: function (token) {

      
      var user = {};
      //get the user
      requestUtil.getJson('graph.microsoft.com', '/v1.0/' + path, token.accessToken, function (result) {
        console.log(token.accessToken);
        if (result != null) {
          console.log(result);
          user = JSON.parse(result);
          if (user !== null) {
            res.render('sendMail', { title: 'Express', data: user });
          }
        }
      });
    },

    onFailure: function (err) {
      res.status(err.code);
      console.log(err.message);
      res.send();
    }
  });
}  // renderSendMail function  


router.post('/', function (req, res, next) { 
  var destinationEmailAddress = req.body.default_email;
  console.log(destinationEmailAddress);
  wrapRequestAsCallback(req.cookies.TOKEN_CACHE_KEY, {

    onSuccess: function (token) {

    requestUtil.getJson('graph.microsoft.com', '/v1.0/me/calendar/events', token.accessToken , function (result) {
        console.log("Getting users Calendars ... " + result.statusCode);
        console.log("\n\ntoken: " + token.accessToken);
        var templateData = {
          title: 'Microsoft Graph Connect',
          data: req.session.user,
          actual_recipient: destinationEmailAddress
        };
        if (result.statusCode >= 400) {
          templateData.status_code = result.statusCode;
        }
        else  {
           console.log('Success calling the graph endpoint .');
           console.log('Checking for permissions .');
          if (result.error) {
            // error code is : ErrorAccessDenied 
            console.log('You have a problem <wit></wit>h permission scope of your application , make sure you have the previlages for the relevant resource .');
          }
          else  {
            console.log('Everything is fine : '+result);
          }
         // TODO :  find out more about this templateData thing .
         // templateData.userCalendar = result ;
        }
      });


      var postBody = emailer.generatePostBody(req.session.user.displayName, destinationEmailAddress);

      requestUtil.postData('graph.microsoft.com', '/v1.0/me/microsoft.graph.sendMail', token.accessToken, JSON.stringify(postBody), function (result) {
        console.log("Send mail status code: " + result.statusCode);
        console.log("\n\ntoken: " + token.accessToken);
        var templateData = {
          title: 'Microsoft Graph Connect',
          data: req.session.user,
          actual_recipient: destinationEmailAddress
        };
        if (result.statusCode >= 400) {
          templateData.status_code = result.statusCode;
        }
        res.render('sendMail', templateData);
      });
    },

    onFailure: function (err) {
      console.log(token.accessToken);
      res.status(err.code);
      console.log(err.message);
      res.send();
    }
  });
});  // routes post  / plain 



//@desc: Notification subscription endpoint 

function requestSubscription(req, res, accessToken) {

  var payload = {
    "changeType":"created",
    "notificationUrl":"https://dash-testbed.heroku.com/notification",
    "resource":"/me/contacts",
    "expirationDateTime":"2017-07-12T11:00:00.000000Z",
    "clientState":"hallow world"
  };


  requestUtil.postData('graph.microsoft.com', '/v1.0/subscriptions', accessToken, JSON.stringify(payload), function (response) {

  if (response.IncomingMessage.statusCode >= 400) {

    console.log("Subscription failure  .");
    res.render("login");
    

  }else {

    console.log("Subscription successful .");
    console.dir(response);//@todo: check what this subscription endpoint has brought back :) 
     res.render("notification");

  }
});
  
}



//@desc: Notifcation reciever endpoint 
router.post("/notification", function (req, res) {
  if (req.query.validationToken) {
    
    console.log("Webhook validation ...");
    res.status(200);
    res.send(req.query.validationToken);
  
  }else {
  
    console.log("Incoming notification ...");
    //Notify graph that data is accepted .
    res.status(202); 
    console.dir(req.body);
  }

});



function wrapRequestAsCallback(tokenKey, callback) {
  authHelper.getTokenFromRefreshToken('https://graph.microsoft.com/', tokenKey, function (token) {
    if (token !== null) {
      callback.onSuccess(token);
    } else {
      callback.onFailure({
        code: 500,
        message: "An unexpected error was encountered acquiring access token from refresh token"
      });
    }
  });
} // routes /
 


module.exports = router;

/*
######################################################################
O365-Nodejs-Microsoft-Graph-Connect, https://github.com/OfficeDev/O365-Nodejs-Microsoft-Graph-Connect

Copyright (c) Microsoft Corporation
All rights reserved.

MIT License:
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
######################################################################
*/
