exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  clientID: 'd2d6267b-a005-4146-b79a-a754e5e0def3',
  clientSecret: 'wLPDOaGMOjWtGu9iUzsWsMcOLrXPwNG9uOdswFFQoj0=',
  redirectUri: 'https://dashdesk.azurewebsites.net/callback'
};


exports.subscriptionConfiguration = {
  ChangeType: "Created, Updated, Deleted",
  notificationUrl: 'https://dashdesk.azurewebsites.net/listen',
  resource: 'me/mailfolders(\'Inbox\')/messages',
  clientState: 'cLIENTsTATEfORvALIDATION'
};



//@source: https://blogs.msdn.microsoft.com/exchangedev/2015/10/21/outlook-rest-api-changes-to-beta-endpoint-part-iii/
// New api version subscriptionConfiguration -request payload 

exports.newsubscriptionConfiguration = {
   NotificationURL: "https://dashdesk.azurewebsites.net/listen",
   resource: 'me/mailfolders(\'Inbox\')/messages',
   ChangeType: "Created, Updated, Deleted",
   ClientState: "cLIENTsTATEfORvALIDATION"
};
