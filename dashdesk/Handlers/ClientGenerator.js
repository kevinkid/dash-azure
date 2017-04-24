var signalr = require("signalrjs");
var signalR = signalr();

module.exports = function (identity) {
    return signalR.hub(identity, {
        Send : function (name, message) {
            this.clients.all.invoke('AddMessage').withArgs([name, message]);
        }
    });
}


/*
 * [Usage]
 * var client = new Client(identity);
 * client.notify(message);
*/