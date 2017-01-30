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
var logger = require("morgan");
var signalrc = require("signalr-client");
var signalr = require("signalrjs");
var signalR = signalr();
var jsdom = require("node-jsdom");
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
// Server Request config
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
//require("./Handlers/dbHandler.js")(mongoose);


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


//@note: getting connections might return no connections after authentication process
// This method counts the number of connections you have .
//@todo: keep track of number of connection using a hook to invoke downloading notification 
// on the client .

function getConnectionByUser(sessionKey){
    var conn = signalR._connectionManager._connections;
    return conn.getByUser(sessionKey);//@todo: check if it returns back a connection .
}

//@returns {Bool} - true if connection established .
function verfyConnection(identity){
    var conList = signalR._connectionManager._connections;
    if(identity){
        if(conList.hasOwnProperty(identity)){
            return true;
        }else {
            return false;
        }
    }
}

//@desc: checks for changes in connections and to initiate
// download of notifications from lost client connections
function connectionsHook(){

}

//@returns{Number} - Number of current connections to the server 
function connectionNum(){
    var currentConnections = signalR._connectionManager._connections; 
    var conCount = 0;
    for(var key in props){
        count += 1;
    }
    console.log("Number count:"+count-1);
    return conCount-1;
}

function sendNotification(identity,msg){
    if(identity){

    }
}


//===========================================================>

app.post("/message",function(req, res){
    var identity ;
    console.dir("------------[SignalR Message ♥ ]----------------------");
    //connections => signalR._connectionManager.[<methods>_connections/_userTokens/delByTokens/forEach/getByToken/getByUser/put]._connections{Object}
    // Get the client connection, if it goesn't exist store the notification untill they are online again .
    var clientManager = signalR._connectionManager;
    console.dir("Connection is:");
    console.dir(clientManager);
    var messageObj = {
        Args:['server','Notification ! '],// <raw message>
        Hub:'MyHub',//<hub name>
        Method:'AddMessage',// <client method>
        State:1// <what ever the state number means>
    };
    clientManager.forEach(function(client){
        // broadcast to all the clients 
        //@todo: narrow down to each client 
        /*Map: - explanation | = prop
        --- Args:Array[2] ["kevin", " like yo"]
        === length:2--
           ==== __proto__:Array[0] --
         ===   0:"kevin"===
         ===   1:" like yo"===
           --- Hub:"MyHub"
          --  Method:"AddMessage"--
           -- State:1--
           // <function>
           	send : function(connection,messageData){
        // <signalr prop>
                  	this._transports['longPolling'] = longPollingTransport; 
    //  <expected>
    signalR._trasports.longPolling.send(<connection>[client],<messageData>[messageObj]);

        */
        console.log("testing fun :) ");
            signalR._transports.longPolling.send(client.connection,messageObj);
        // signalR._transports.serverSentEvents.send(client.connection,['Server','Notification !']);// √
    });
    
    // console.dir(signalR._transports.serverSendEvents.clients.all.invoke('AddMessage').withArgs(['Server','Notification from the server .']));// √
    console.dir("------------[SignalR Message]-----------------------");

    res.json("Notification sent !");

});




//Working client-server communication [virtual client]
app.post('/working browser signalr client', function(req, res){
    
//  var baseUrl = Url.parse(req.url).host;
// @note: since its server side you can use localhost to make it faster . 
// @todo: since we are calling for internal resources try using localhost .
// var jquery = baseUrl+"/js/jquery-1.10.2.min.js";
// var jQuerySignalR = baseUrl+"js/jQuery.signalR.js";
// @docs: https://www.npmjs.com/package/node-jsdom


//------------------------------------------------------->

var browser = jsdom.env(
  // @note: get the url from node.env object 
  "http://localhost:3000",
  // @note: The url above should be server served which we dont want 
  ["http://localhost:3000/js/jquery-1.10.2.min.js","http://localhost:3000/js/jquery.signalR-2.0.3.min.js"],
  function (errors, window) {
    
    console.log("Browser loaded ");
    console.log(window.$.connection);
    // @docs: https://www.npmjs.com/package/signalrjs
      var $ = window.$;

      var connection = $.connection('http://localhost:3000/');
        connection.error(function(error){
            console.dir("Connection Error");
            console.log(error);
        });

        connection.received(function (data) {
            console.log('The time is ' + data);
        });

        connection.start().done(function() {
            console.log("connection started!");
            console.dir("connection state: "+connection.state);
        });
        
    //   var connection = $.connection.hub;
    //   var MyHub = $.connection.MyHub;

    //   $.connection.hub.start().done(function(){
    //       MyHub.server.send('message string'); // this should be an array with name and message 
    //   }); 
    //   $.connection.hub.end();

  });

browser = null; // Dispose of the browser after each notification .


//------------------------------------------------------------->


    res.json("notification recieved  !");
    // Dispose the client after send the message .
    return;

});






//==============================================================>


/**
 * [signalR object] try to find the socket event emitter.
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




// Client - Server hub connection  
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



var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    //[file loging doesn't workin in azure ]fs.writeFile('./log.txt', 'Starting [' + (new Date(Date.now() + 86400000).toISOString())+']',{encoding: "utf8",mode: "0o666",flag: "w"}, function () {console.dir("App loging");});
});


// @todo; replace the script statement in cmd file with this
//node.exe %1 %2 %3

module.exports = app;
