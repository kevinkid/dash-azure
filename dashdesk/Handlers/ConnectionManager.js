/**
 * @author - bigkevzs 
 * @todo - Use this file to instanciate a new hubproxy when instlling a new client ,
 *         make the method unique to each client using the Sessionkey such that both 
 *         the server method called by the client will be the sessionkey . 
 */

module.exports = {
    getConnectionByUser : function (signalR, sessionKey) {
        var conn = signalR._connectionManager._connections;
        return conn.getByUser(sessionKey);
    },
    verify : function verfyConnection(signalR, identity) {
        var conList = signalR._connectionManager._connections;
        if (identity) {
            if (conList.hasOwnProperty(identity)) {
                return true;
            } else {
                return false;
            }
        } 
    },
    hook : function (signalR) {
        return 'difference in connection since last check';
    },
    connections: function (signalR) {
        var currentConnections = signalR._connectionManager._connections;
        var conCount = 0;
        for (var key in props) {
            count += 1;
        }
        console.log("Number count:" + count - 1);
        return conCount - 1;
    },
    sendNotification : function (virtualClient, Name, Message) {
        console.dir("Sending notification .");
        try {
            
            var html = "<!DOCTYPE html> <html> <head> <title></title> </head> <body> </body> </html>";
            
            virtualClient.env(html, function (errors, window) {
                var data = "{\n\t\"name\":\"" + Name + ",\n\t\"message\":\"" + Message + "\n}"

                var xhr = new window.XMLHttpRequest();
                xhr.withCredentials = true;
                
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        console.log(this.responseText);
                    }
                });
                
                xhr.open("POST", "https://dashdesk.azurewebsites.net/noitacifiton?name=" + Name + "&message=" + Message);
                xhr.setRequestHeader("content-type", "application/json");
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.setRequestHeader("session-token", "fb5d3dac-ec35-6a04-00b5-3db8c89a8472");

                xhr.send(data);
            });
            
        } catch (ex) {
            throw ex;
        }
    }
};



