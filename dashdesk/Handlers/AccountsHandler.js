/**
 * @desc - Manages differnt account credentails, in the 
 * end all the accounts authentication implementations
 *  are going to be in here .
 */
var mongoose = require('mongoose');
var db = require('./../dbHelper');
var settings = require('../app').settings;

var AccountUrls = {
    'skype' :  '',
    'outlook': '',
    'gmail': '',
    'yahoo': '',
    'yammah': ''
};


/**
 * @todo - This method checks account availability which depends on 
 *          the clientkey, find a way a clientkey generator which is 
 *          registered on the first account to be installed.
 * @desc - Determines whether the auth url requested account exist 
 * @type {Function}
 * @returns {string} - The authentication url for the perticular account 
 */
function GetAuthUrl(accountType,clientkey) {
    if (!clientkey &&  accountType != null) {
        var IsExisting = VerfityAccountExistance(accountType);
        if((typeof IsExisting) == 'boolean') {
            return AccountUrls[accountType];
        }else {
            return IsExisting;
        }
    }else {
        console.log('Please provide all the parameters ');
    }
}



/**
 * @param {string} - The account type that is used 
 * @returns{bool} - Boolean value of whether the  account exist 
 */
function VerfityAccountExistance(clientkey) {
    ///Todo : Check for account credentails from the database 
    db.FindClient(mongoose,{data: clientkey},clientkey,function(dbClient){
        if (dbClient == undefined){
            return false;
        }else {
            return dbClient;
        }
    });
}



