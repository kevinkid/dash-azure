/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var AuthenticationContext = require('adal-node').AuthenticationContext;
var adalConfiguration = require('../constants.js').adalConfiguration;
var resource = 'https://graph.microsoft.com/';

/**
 * Generate a fully formed uri to use for authentication based on the supplied resource argument
 * @return {string} a fully formed uri with which authentication can be completed.
 */
function getAuthUrl() {
    return adalConfiguration.authority + '/oauth2/authorize' +
    '?client_id=' + adalConfiguration.clientID +
    '&response_type=code' +
    '&redirect_uri=' + adalConfiguration.redirectUri;
}

/**
 * Gets a token for a given resource.
 * @param {string} code An authorization code returned from a client.
 * @param {string} res A URI that identifies the resource for which the token is valid.
 * @param {AcquireTokenCallback} callback The callback function.
 */
function getTokenFromCode(code, callback) {
    var authContext = new AuthenticationContext(adalConfiguration.authority);
    authContext.acquireTokenWithAuthorizationCode(
        code,
    adalConfiguration.redirectUri,
    resource,
    adalConfiguration.clientID,
    adalConfiguration.clientSecret,
    function (error, token) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, token);
            }
        }
    );
}

/**
 * get accesstoken from refreshtoken
 * @param  {String}   refereshToken stored refreshtoken
 * @param  {Function} callback      
 */
function getTokenFromRefreshToken(refereshToken, callback) {
    var authContext = new AuthenticationContext(adalConfiguration.authority);
    authContext.acquireTokenWithRefreshToken(
        refereshToken,
        adalConfiguration.redirectUri,
        resource,
        adalConfiguration.clientID,
        adalConfiguration.clientSecret,
        function (error, token) {
            if (error) {
                console.log("error Getting token from refereshToken .");
                callback(error,null);
            }else {
                console.log("Succss getting access token .");
                callback(null,token);
            }
        })
}

exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;

