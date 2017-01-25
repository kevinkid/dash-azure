exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  clientID: 'd2d6267b-a005-4146-b79a-a754e5e0def3',
  clientSecret: 'wLPDOaGMOjWtGu9iUzsWsMcOLrXPwNG9uOdswFFQoj0=',
  redirectUri: 'https://dashdesk.azurewebsites.net/callback'
};


exports.subscriptionConfiguration = {
  changeType: 'Created',
  notificationUrl: 'https://dashdesk.azurewebsites.net/listen',
  resource: 'me/mailFolders(\'Inbox\')/messages',
  clientState: 'cLIENTsTATEfORvALIDATION'
};



//@source: https://blogs.msdn.microsoft.com/exchangedev/2015/10/21/outlook-rest-api-changes-to-beta-endpoint-part-iii/
// New api version subscriptionConfiguration -request payload 

exports.newsubscriptionConfiguration = {
   Resource: "https://outlook.office.com/api/beta/me/folders('Inbox')/messages",
   NotificationURL: "https://dashdesk.azurewebsites.net/listen",
   ChangeType: "Created, Updated, Deleted",
   ClientState: "cLIENTsTATEfORvALIDATION"
};
