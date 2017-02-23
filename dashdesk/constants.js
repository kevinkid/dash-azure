/// NOTE: Register for new credentials using the dev.office.com website 
/// that way a admin group doesn 't have to install the application on 
/// the tenant before you can use the application. 

exports.adalConfiguration = {
    authority: 'https://login.microsoftonline.com/common',
    clientID: 'd2d6267b-a005-4146-b79a-a754e5e0def3',
    clientSecret: 'wLPDOaGMOjWtGu9iUzsWsMcOLrXPwNG9uOdswFFQoj0=',
    //clientID : '732617fd-15b7-4f14-9c8d-218e2cedfc45',
    //clientSecret: 'dDkoENVi+oT3//Hh1Y79AO2rjIfSXkBljkswdKM3Vkg=',
    redirectUri: 'https://dashdesk.azurewebsites.net/callback'
};


exports.subscriptionConfiguration = {
    changeType: "Created, Deleted",
     notificationUrl: "https://dashlisten.usefinch.eu",
    //notificationUrl: "https://dashdesk.azurewebsites.net/listen",
    resource: 'me/mailFolders(\'Inbox\')/messages',
    clientState: 'cLIENTsTATEfORvALIDATION'
};

