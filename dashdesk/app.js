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
var signalr = require("signalrjs");
// var signalr = require("./node_modules/signalrjs/lib/jquery.signalR-2.0.2.js");
var signalR = signalr();
var jsdom = require("node-jsdom");
var Url = require("url");

//var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));// @todo: Debug json parsing and use it for storing credentails/ its already in json  


// Port config 
app.set('port', process.env.PORT || 3000);

// Environment config 
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';


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



// server client communication 
app.post('/message', function(req, res){
    //  var baseUrl = Url.parse(req.url).host;
    // @note: since its server side you can use localhost to make it faster . 
    // @todo: since we are calling for internal resources try using localhost .
// var jquery = baseUrl+"/js/jquery-1.10.2.min.js";
// var jQuerySignalR = baseUrl+"js/jQuery.signalR.js";
// @docs: https://www.npmjs.com/package/node-jsdom
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
//https://dashdesk.azurewebsites.net
      var connection = $.connection('http://localhost:3000/signalr');
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

    res.json("notification recieved  !");
    // Dispose the client after send the message .
    return;

});

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes config 
app.use('/', routes);
app.use('/listen', listen);


// Client - Server hub connection  
var hub = signalR.hub('MyHub', {
    Send : function (name, message) {
        // @note: This type of 
        console.log(this);
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
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
