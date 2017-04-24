
var mongoose = require('mongoose');
var db = require('../Helpers/dbHelper');
var config = require('../api/config');



// TODO: Include other accounts that are easier .
function generateAuthURL (account) {
    return 'AccountUrls[accountType]';
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



