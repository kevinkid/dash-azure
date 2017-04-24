var express = require("express");
var router = express.Router();
var signalr = require("signalrjs");
var signalR = signalr();


router.post("/message", function (req, res) {
    var clientManager = signalR._connectionManager;
    var messageObj = {
        Args: ['server', req.body.notification],
        Hub: 'MyHub',
        Method: 'AddMessage',
        State: 1
    };
    clientManager.forEach(function (client) {
        signalR._transports.longPolling.send(client.connection, messageObj);// √
    });
    
    res.json("Notification sent !");

});

module.exports = router;
