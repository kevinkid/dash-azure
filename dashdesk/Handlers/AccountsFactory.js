
var mongoose = require('mongoose');
var db = require('../Helpers/dbHelper');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var config = require('../api/config');
var adalConfiguration = config.accounts.office.credentials;
var resource = 'https://graph.microsoft.com/';


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
