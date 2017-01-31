var signalr = require("signalr");
var signalR = signalr();

module.exports = function (identity) {
    return signalR.hub(identity, {
        Send : function (name, message) {
            // @note: This type of 
            console.log(this);
            this.clients.all.invoke('AddMessage').withArgs([name, message]);
            console.log('send:' + message);
        }
    });
}


/*
 * [Usage]
 * var client = new Client(identity);
 * client.notify(message);
*/