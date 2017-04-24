/*--------------------------------------------------------------
var browser = jsdom.env(
  "http://localhost:3000",
  ["http://localhost:3000/js/jquery-1.10.2.min.js","http://localhost:3000/js/jquery.signalR-2.0.3.min.js"],
  function (errors, window) {
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

//-------------------------------------------------------------*/
