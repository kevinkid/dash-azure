var fs = require("fs");
var Url = require("url");
var path = require('path');
var http = require('http');
var qs = require("querystring");
var express = require('express');
var app = express();
var mongoose = require("mongoose");
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var signalr = require("signalrjs");
var signalR = signalr();
var jsdom = require("jsdom-no-contextify");
var message = require("./routes/message");
var listen = require("./routes/listen");
var routes = require("./routes/index");
var db = require("./Helpers/dbHelper");
var client = require("./Handlers/client");
var notifications = require("./Handlers/notifications");
var settings = JSON.parse(fs.readFileSync(path.join(__dirname,'./settings.json'), 'utf8').replace("﻿",""));  
var DBConnection = mongoose.connection;
DBConnection.setMaxListeners(0);
//var cors = require("cors");

// settings 
app.CONFIG = settings;

console.dir(settings);

// Port config 
app.set('port', process.env.PORT || 3000);

// Environment config 
// Note : There is no production env 
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';



/**
 * @desc - signalr hub configuration .
 * @todo - Modularize this implementation 
 */
signalR.serverProperties.ProtocolVersion = 1.3;
app.use(signalR.createListener());
console.dir("Protocal v:" + signalR.serverProperties.ProtocolVersion);// remove me 

signalR.hub('MyHub', {
    Send : function (name, message) {
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
    }
});



// cors config 
//app.use(cors());

// Db config 
var DBoptions = {
    server: { socketOptions: { keepAlive: 500000, connectTimeoutMS: 50000, auto_reconnect: true } }, 
    replset: { socketOptions: { keepAlive: 500000, connectTimeoutMS : 50000, auto_reconnect: true } }
};



// View config 
app.use(require('stylus').middleware(path.join(__dirname, 'dash-frontend')));
app.use(favicon(__dirname + '/dash-frontend/img/favicon.ico'));
app.use(express.static(path.join(__dirname, 'dash-frontend')));
app.set('views', path.join(__dirname, 'dash-views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Routes config 
app.use('/', routes);
app.use('/listen', listen);
app.use('/message', message);




/**
 * Note: This Database Auto reconnect implementation has a memory leak .
 */
mongoose.connect((settings[(env === "development")? "development" : "production"]).database.host, DBoptions);

DBConnection.on('error', function(){
    mongoose.disconnect();
});
 

DBConnection.on('disconnected', function(){
    mongoose.connect((settings[(env === "development")? "development" : "production"]).database.host, DBoptions);
});

    
DBConnection.once('open', function () {
    console.log("Database connection established ");
    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
});


module.exports = app;
