module.exports = function (SessionKey, SignalR) {
    
    var listener = function () {
        
        // Client - Server hub connection  
        SignalR.hub(SessionKey, {
            Send : function (name, message) {
                // @note: This type of 
                this.clients.all.invoke('AddMessage').withArgs([name, message]);
                console.log('send:' + message);
            }
        });

    }
    
    
    // Define constructor 
    var ClientConnection = function () {
        this.setListener = listener;
    };
    
    return ClientConnection;
}


