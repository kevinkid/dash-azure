'use strict';

var minify = require('./minify');

module.exports = {
	connectionResponse : function(responseObject){
		var defaultResponseObject = {
			"MessageId": + ""+(new Date()).toString(),
			"LongPollDelay": 5000, 
			"Initialized": true,
			"ShouldReconnect" : false,
			"GroupsToken" : null,
			"Messages" : []
		};
		if(!responseObject)
			responseObject = defaultResponseObject;
		return JSON.stringify(minify(responseObject));
		// @note: Send object instead because that is what the client is expecting .
		// @note: Find a way to parse the string to json before sending, this means you 
		// need an exposed variable leading to this property so that we can convert it. 
	},
	message : function (messageData) {
		if(!messageData)
			return '{}';
		
		if(!(messageData instanceof Array))
			messageData = [messageData];

		var message = {
			"MessageId": new Date(),// This is giving an int parse error in the client .
			"Messages" : messageData
		};
		return JSON.stringify(minify(message));
	},
	response : function(responseData){
		return JSON.stringify(minify(responseData));	
	}
};