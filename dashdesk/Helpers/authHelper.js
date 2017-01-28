/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var AuthenticationContext = require('adal-node').AuthenticationContext;
var adalConfiguration = require('../constants.js').adalConfiguration;
var resource = 'https://graph.microsoft.com/';
var premissions = "mail.read";



// No permissions
//https://login.microsoftonline.com/common/oauth2/authorize?client_id=d2d6267b-a005-4146-b79a-a754e5e0def3&response_type=code&redirect_uri=https://dashdesk.azurewebsites.net/callback
// Permission
// https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token+token&scope=openid%20User.Read%20User.ReadWrite%20User.ReadBasic.All%20Mail.ReadWrite%20Mail.ReadWrite.Shared%20Mail.Send%20Mail.Send.Shared%20Calendars.ReadWrite%20Calendars.ReadWrite.Shared%20Contacts.ReadWrite%20Contacts.ReadWrite.Shared%20MailboxSettings.ReadWrite%20Files.ReadWrite%20Files.ReadWrite.All%20Files.ReadWrite.Selected%20Files.ReadWrite.AppFolder%20Notes.ReadWrite%20Notes.ReadWrite.All%20Notes.ReadWrite.CreatedByApp%20Notes.Create%20Tasks.ReadWrite%20Tasks.ReadWrite.Shared%20Sites.ReadWrite.All&client_id=de8bc8b5-d9f9-48b1-a8ad-b748da725064&redirect_uri=https%3A%2F%2Fgraph.microsoft.io%2Fen-us%2Fgraph-explorer&state=adeb4bc1-3873-4b65-95e3-c62942ff640d&client-request-id=918029ba-8506-4307-8d9e-77cfc53f945e&x-client-SKU=Js&x-client-Ver=2.0.0-experimental&nonce=a3b400db-e36c-423f-ab9c-7b41b2679e0f
https://login.microsoftonline.com/common/v2.0/oauth2/authorize?client_id=d2d6267b-a005-4146-b79a-a754e5e0def3&response_type=codescope=openid%20User.Read%20User.ReadWrite%20User.ReadBasic.All%20Mail.ReadWrite%20Mail.ReadWrite.Shared%20Mail.Send%20Mail.Send.Shared%20Calendars.ReadWrite%20Calendars.ReadWrite.Shared%20Contacts.ReadWrite%20Contacts.ReadWrite.Shared%20MailboxSettings.ReadWrite%20Files.ReadWrite%20Files.ReadWrite.All%20Files.ReadWrite.Selected%20Files.ReadWrite.AppFolder%20Notes.ReadWrite%20Notes.ReadWrite.All%20Notes.ReadWrite.CreatedByApp%20Notes.Create%20Tasks.ReadWrite%20Tasks.ReadWrite.Shared%20Sites.ReadWrite.All&redirect_uri=https://dashdesk.azurewebsites.net/callback
/**
 * Generate a fully formed uri to use for authentication based on the supplied resource argument
 * @return {string} a fully formed uri with which authentication can be completed.
 * @note: There are no permissions specified, maybe thats why this silently fails .
 */
function getAuthUrl() {
  return adalConfiguration.authority + '/oauth2/authorize'+
    '?client_id=' + adalConfiguration.clientID +
    '&response_type=code' +
    //'resource=openid%20User.Read%20User.ReadWrite%20User.ReadBasic.All%20Mail.ReadWrite%20Mail.ReadWrite.Shared%20Mail.Send%20Mail.Send.Shared%20Calendars.ReadWrite%20Calendars.ReadWrite.Shared%20Contacts.ReadWrite%20Contacts.ReadWrite.Shared%20MailboxSettings.ReadWrite%20Files.ReadWrite%20Files.ReadWrite.All%20Files.ReadWrite.Selected%20Files.ReadWrite.AppFolder%20Notes.ReadWrite%20Notes.ReadWrite.All%20Notes.ReadWrite.CreatedByApp%20Notes.Create%20Tasks.ReadWrite%20Tasks.ReadWrite.Shared%20Sites.ReadWrite.All'+
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



exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
