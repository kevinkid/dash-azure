var app = express();
var fs = require("fs");
//var cors = require("cors");
var signalR = signalr();
var Url = require("url");
var path = require('path');
var http = require('http');
var logger = require("morgan");
var qs = require("querystring");
var express = require('express');
var signalr = require("signalrjs");
var mongoose = require("mongoose");
var favicon = require('serve-favicon');
var routes = require("./routes/index");
var listen = require("./routes/listen");
var bodyParser = require('body-parser');
var message = require("./routes/message");
var jsdom = require("jsdom-no-contextify");
var db = require("./Handlers/dbHandler.js");
var client = require("./Handlers/client.js");
var notifications = require("./Handlers/notifications.js");
var settings = JSON.parse(fs.readFileSync(path.join(__dirname,'./settings.json'), 'utf8').replace("﻿",""));// @todo: Debug json parsing and use it for storing credentails/ its already in json  


//---
var mongoose = require("mongoose");
var client = require("./Handlers/client.js");
var db = require("./Handlers/dbHandler.js");
var requestHelper = require('./helpers/requestHelper.js');
var connectionManager = require("./Handlers/ConnectionManager.js");
//---


// Port config 
app.set('port', process.env.PORT || 3000);

// Environment config 
// Note : There is no production env 
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';


// cors config 
//app.use(cors());

// Db config 
var options = {
    server: { socketOptions: { keepAlive: 500000, connectTimeoutMS: 50000 } }, 
    replset: { socketOptions: { keepAlive: 500000, connectTimeoutMS : 50000 } }
};

mongoose.connect((settings[(env === "development")? "development" : "production"]).database.host);
var conn = mongoose.connection;


//SignalR config
signalR.serverProperties.ProtocolVersion = 1.3;
app.use(signalR.createListener());
console.dir("Protocal v:" + signalR.serverProperties.ProtocolVersion);


// View config 
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Routes config 
app.use('/', routes);
app.use('/listen', listen);
app.use('/message', message);


app.post("/message", function (req, res) {

    var clientManager = signalR._connectionManager;

    var messageObj = {
        Args: ['server', req.body.notifcaton],
        Hub: 'MyHub',
        Method: 'AddMessage',
        State: 1
    };

    clientManager.forEach(function (client) {
        signalR._transports.longPolling.send(client.connection, messageObj);// √
    });
    res.json("Notification sent !");
});




/*------------------------------------------------------------
------------------[Database Operations Test]------------------*/


app.post('/store', function (req, res) {
    //@note: the passing the client as param may not work 
    db.InstallClient(mongoose, req.body.notifications, client, function () { });
    console.dir("Success storing data");
    res.json({ Message: "Success storing data" });
    res.status(200);
});

app.get('/get', function (req, res) {
    //qs,mongoose, data, client, callback
    db.GetSubscription(qs, mongoose, "4a1c26bd-5666-4e04-ab7f-528d1116be76", client, function (subscriptionData) {
        res.json(subscriptionData);
        res.status(200);
    });
});

/// Get last message using graph
///NOTE: Use to reply to notifications . 
app.post('/test', function (req, res) {
    var resource,
        token;
    db.GetSubscription(requestHelper, qs, mongoose, "4a1c26bd-5666-4e04-ab7f-528d1116be76", client, function (subscriptionData) {
        if (subscriptionData) {
            if (subscriptionData !== null) {
                // resource = "https://graph.microsoft.com/v1.0/me/"+subscriptionData.tenantId+"/messages?$top=1";//@todo: add the user Id from the token object
                resource = "https://graph.microsoft.com/v1.0/me/messages?$top=1";
                // nodejs is refusing to make two server requests inside of callbacks . am not sure if did that before . 
                token = subscriptionData;
                res.status(202);
                res.end();// A single thread cannot make two request at the same time . 
                GetMail(resource, token);
            }
        } else {
            res.status(500);
        }
    });
});

function GetMail(resource, subscriptionData) {
    console.dir("Getting email .");
    requestHelper.getData(
        '/beta/me/' + resource, subscriptionData,
        function (requestError, endpointData) {
            console.log(endpointData);
            if (endpointData) {
                // res.status(202);
                console.dir(endpointData);
                console.dir("From : " + endpointData.value[0].from.users);
                console.dir("Email : " + endpointData.value[0].body.content);// content is in html parse or something .
                db.StoreNotification(mongoose, qs.escape(JSON.stringify(endpointData).clientDetails[0]), notification);
                connectionManager.sendNotification(signalR, null, JSON.stringify(endpointData));
            } else if (requestError) {
                console.dir(requestError);
            }
        }
    );
}

app.post('/noitacifiton', function (req, res) {

    var clientManager = signalR._connectionManager,
        Name = req.query.name,
        Message = req.query.message;
    var messageObj = {
        Args: [Name, Message],
        Hub: 'MyHub',
        Method: 'AddMessage',
        State: 1
    };
    try{
        clientManager.forEach(function (client) {
            signalR._transports.longPolling.send(client.connection, messageObj);// √
        });
        console.dir("Notification sent !");
                res.json("Success");
    }catch(ex){
        res.json(ex);
        throw ex;
    }
});
    
///*---------------------------------------------------------*/



// Client - Hub connection instance   
signalR.hub('MyHub', {
    Send : function (name, message) {
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
    }
});


conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    
    console.log("Database connection established ");
    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

});

module.exports = app;
