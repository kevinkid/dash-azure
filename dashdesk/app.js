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
var virtualClient ;
//var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));// @todo: Debug json parsing and use it for storing credentails/ its already in json  


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
  res.header("Access-Control-Allow-Origin", "http://localhost:17284");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Origin, Content-Type, Access-Control-Allow-Credentials, Access-Control-Allow-Headers");
  next();
});


// Db config 
//mongoose.connect((settings[(env === "development")? "development" : "production"]).database.host);
//  mongoose.connect("mongodb://dash2682:dash2682@ds056419.mlab.com:56419/dash");// prod
mongoose.connect("mongodb://localhost:27017/dash");// local 


//SignalR config
signalR.serverProperties.ProtocolVersion = 1.3;
app.use(signalR.createListener());
console.dir("Protocal v:" + signalR.serverProperties.ProtocolVersion);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes config 
app.use('/', routes);
app.use('/listen', listen);
app.use('/message',message);


/**
 * [signalR object]
 * 
 *  {
  route: '/signalr',
  serverProperties: 
   { KeepAliveTimeout: 20,
     DisconnectTimeout: 30,
     ConnectionTimeout: 110,
     TryWebSockets: false,
     ProtocolVersion: 1.5,
     TransportConnectTimeout: 5,
     LongPollDelay: 0,
     HeartBeatInterval: 15000 },
  _transports: 
   { serverSentEvents: 
      { _connectionDetails: [Object],
        _writeServerSendEvent: [Function],
        connect: [Function],
        send: [Function],
        sendHeartBeat: [Function] },
     longPolling: 
      { _connectionDetails: [Object],
        connect: [Function],
        send: [Function] } },
  _connectionManager: 
   { _connections: {},
     _userTokens: 
      { _userTokens: {},
        put: [Function],
        getByUser: [Function],
        delByUser: [Function],
        delByToken: [Function] },
     put: [Function],
     updateConnection: [Function],
     getByToken: [Function],
     getByUser: [Function],
     forEach: [Function],
     setUserToken: [Function],
     delByToken: [Function] } }
 * 
 */


// Client - Hub connection instance   
var hub = signalR.hub('MyHub', {
    Send : function (name, message) {
        
        // client AddMessage method are invoked from the clients property
        // of the Send property which belongs to the hub instance created 
        // Each hub instance contains an object and a hub name. 
        console.dir("-------------------[Hub Message]-----------------");
        console.log(this);
        console.dir("-------------------[Hub Message]-----------------");
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
        // this.clients.user("user name").invoke('AddMessage').withArgs(["name","custom message"]);
        // this.Send('username','message from send function');// @note: maybe store this script and be invoking it ?
        console.log('send:' + message);
    }
});


app.post("/message",function(req, res){
    var clientManager = signalR._connectionManager;
    var messageObj = {
        Args:['server',req.body.notifcaton],
        Hub:'MyHub',
        Method:'AddMessage',
        State:1
    };
    clientManager.forEach(function(client){
        signalR._transports.longPolling.send(client.connection,messageObj);// √
    });
    
    res.json("Notification sent !");

});

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    //[file loging doesn't workin in azure ]fs.writeFile('./log.txt', 'Starting [' + (new Date(Date.now() + 86400000).toISOString())+']',{encoding: "utf8",mode: "0o666",flag: "w"}, function () {console.dir("App loging");});
});


// @todo; replace the script statement in cmd file with this
//node.exe %1 %2 %3

module.exports = app;
