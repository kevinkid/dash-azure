var express = require('express');
var app = express();
var http = require('http');
var fs = require("fs");
var path = require('path');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var routes = require("./routes/index");
var listen = require("./routes/listen");
var message = require("./routes/message");
var logger = require("morgan");
var signalr = require("signalrjs");
var signalR = signalr();
var Url = require("url");
var db = require("./Handlers/dbHandler.js");
var client = require("./Handlers/client.js");
var notifications = require("./Handlers/notifications.js");
//var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));// @todo: Debug json parsing and use it for storing credentails/ its already in json  

//---
var mongoose = require("mongoose");
var client = require("./Handlers/client.js");
var db = require("./Handlers/dbHandler.js");
//---

// Port config 
app.set('port', process.env.PORT || 3000);

// Environment config 
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';



// cors config 
app.use(function(req, res, next) {
  req.header("Access-Control-Allow-Headers","Content-Type");
  req.header("Access-Control-Allow-Headers","Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Headers","Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Origin", "https://*/*");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Origin, Content-Type, Access-Control-Allow-Credentials, Access-Control-Allow-Headers");
  next();
});


// Db config 

var options = { server: { socketOptions: { keepAlive: 500000, connectTimeoutMS: 50000 } }, 
                replset: { socketOptions: { keepAlive: 500000, connectTimeoutMS : 50000 } } };  
//mongoose.connect((settings[(env === "development")? "development" : "production"]).database.host);
mongoose.connect("mongodb://dash2682:dash2682@ds056419.mlab.com:56419/dash",options);// prod
// mongoose.connect("mongodb://localhost:27017/dash");// local 
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
    db.InstallClient(mongoose, req.body.notifications, client,function () {});
    console.dir("Success storing data");
    res.json({ Message: "Success storing data" });
    res.status(200);
});
app.get('/get', function (req, res) {
    db.GetSubscription(mongoose, 'some random data that we need .', client, function (subscriptionData) {
        res.json(subscriptionData);
        res.status(200);
    });
});
///*---------------------------------------------------------*/





// Client - Hub connection instance   
signalR.hub('MyHub', {
    Send : function (name, message) {
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
        console.dir("-------------------[Hub Message]-----------------");
        console.log('Message:' + message);
        console.dir("-------------------[Hub Message]-----------------");
    }
});



conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {

    console.log("Database connection established ");

    
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

});

module.exports = app;
