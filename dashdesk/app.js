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
var signalR = signalr();
//var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));// @todo: Debug json parsing and use it for storing credentails/ its already in json  


// Port config 
app.set('port', process.env.PORT || 3000);

// Environment config 
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';


// Db config 
//mongoose.connect((settings[(env === "development")? "development" : "production"]).database.host);
//mongoose.connect("mongodb://dash2682:dash2682@ds056419.mlab.com:56419/dash");// prod
//mongoose.connect("mongodb://localhost:27017/dash");// local 
//require("./Handlers/dbHandler.js")(mongoose);

// Express cors config 
//app.use(function (req, res, next) {
//    req.header("Access-Control-Allow-Headers", "Content-Type");
//    res.header("Access-Control-Allow-Origin", "https://dashdesk.azurewebsites.net");
//    res.header("Access-Control-Allow-Headers", "Content-Type");
//    res.header("Access-Control-Allow-Credentials", "false");
//    res.header("Origin, Content-Type, Access-Control-Allow-Credentials, Access-Control-Allow-Headers");
//    next();
//});


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

// Capture 404 errors 
app.use(function (req, res, next) {
    var error = new error('Not Found ');
    error.status = 404;
    next(error);
});


// Error Handling  
if (app.get("env") === "development") {
    app.use(function (err, req, res) {
        res.render("error", {
            message: err.message,
            error: err,
            title: "Error"
        });
    });
}


// Client - Server hub connection  
signalR.hub('MyHub', {
    Send : function (name, message) {
        // @note: This type of 
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
        console.log('send:' + message);
    }
});


var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
