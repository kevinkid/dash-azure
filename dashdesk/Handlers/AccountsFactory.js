
var mongoose = require('mongoose');
var db = require('../Helpers/dbHelper');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var config = require('../api/config');
var adalConfiguration = config.accounts.office.credentials;
var resource = 'https://graph.microsoft.com/';
var db = require('../Helpers/dbHelper');

function Query (email) {
    // TODO: query the database for the account 
    db.findClient()
}

// TODO: Include other accounts that are easier .
function generateAuthURL (account) {
    switch (account) {
        case "outlook":  
        return adalConfiguration.authority + '/oauth2/authorize' +
                        '?client_id=' + adalConfiguration.clientID +
                            '&response_type=code' +
                        '&redirect_uri=' + adalConfiguration.redirectUri;
        break;

        case "gmail":
        return "Gmail Authentication url";
        break;

        case "slack":
        return "slack Authentication url";
        break;

        case "evernote":
        return "evernote Authentication url";
        break;
    }
}



/** @return {string} a fully formed uri with which authentication can be completed. */
function getAuthUrl() {
    return adalConfiguration.authority + '/oauth2/authorize' +
                    '?client_id=' + adalConfiguration.clientID +
                        '&response_type=code' +
                    '&redirect_uri=' + adalConfiguration.redirectUri;
}


function getAuthenticationURL(accountType, clientkey) {
    if (!clientkey &&  accountType != null) {
        var Existing = verifyAccount(accountType);
        if((typeof Existing) == 'boolean') {
            return generateAuthURL(accountType);
        }
    }
}

// NOTE: There are two reason why we might need to verify for an account 
// 1. if a user is installing a new client 
// 2. if a user is installing a new client in a different machine 
// TODO: Make sure the client set the clientkey on the browser for us to 
//       query. That is if the clientkey exist .

function verifyAccount(clientkey) {
    db.findClient(mongoose,{data: clientkey},clientkey,function(dbClient){
        if (dbClient == undefined){
            return false;
        } else {
            return dbClient;
        }
    });
}



module.exports = {
    verifyAccount: verifyAccount,
    getAuthenticationURL: getAuthenticationURL,
    getAuthUrl: getAuthUrl 
};
