'use strict';

var messageFactory = require('../common/messageFactory');

module.exports = {
	_connectionDetails : {
		"Messages" : [],
		"Initialized": true,
		"GroupsToken" : null,
		"LongPollDelay": 5000, 
		"MessageId": + new Date(),
		"ShouldReconnect" : false
	},
	_writeServerSendEvent : function(connection, data){
		//@todo: Try changing the value of c because its the only difference .
		//data.c = "d-9AA54459-A,1|B,0|C,1|D,0";
 		connection.write({Data:data});
	},
	connect : function(connection){
		connection.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});
		this._writeServerSendEvent(connection,"initialized");
		var message = messageFactory.connectionResponse(this._connectionDetails);
		this._writeServerSendEvent(connection, message);
	},
	send : function(connection,messageData){
		var message = messageFactory.message(messageData);
		this._writeServerSendEvent(connection,message);
	},
	sendHeartBeat : function(connection){
		this.send(connection);
	}
};