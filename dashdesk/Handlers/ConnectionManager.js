module.exports = {
    getConnectionByUser : function (signalR, sessionKey) {
        var conn = signalR._connectionManager._connections;
        return conn.getByUser(sessionKey);//@note: Doesn't return a connection
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
            //TODO: Stop broadcasting .
            var browser = virtualClient.env(
            "http://localhost:3000",
            ["http://localhost:3000/js/jquery-1.10.2.min.js"],
            function (errors, window) {
                if(!errors){
                    var $ = window.$;

                    var settings = {
                        "async": true,
                        "url": "http://localhost:3000/noitacifiton",
                        "method": "POST",
                        "headers": {
                            "content-type": "application/json",
                            "transport-token": "365b0130-a957-f155-a505-ec0fa39363ce"
                        },
                        "processData": false,
                        "data": JSON.stringify({
                            name: Name,
                            message: Message
                        })
                    }
                    $.ajax(settings).done(function (response) {
                        console.dir("Notify response :"+response);
                    });

                }else {
                    console.log(errors);
                }
            });

            // browser = null; //TODO: Dispose 
        
    }
};
