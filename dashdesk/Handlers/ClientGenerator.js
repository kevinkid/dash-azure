// Client - Server hub connection  
var hub = signalR.hub('MyHub', {
    Send : function (name, message) {
        // @note: This type of 
        console.log(this);
        this.clients.all.invoke('AddMessage').withArgs([name, message]);
        console.log('send:' + message);
    }
});