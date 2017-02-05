exports.adalConfiguration = {
    authority: 'https://login.microsoftonline.com/common',
    clientID: 'd2d6267b-a005-4146-b79a-a754e5e0def3',
    clientSecret: 'wLPDOaGMOjWtGu9iUzsWsMcOLrXPwNG9uOdswFFQoj0=',
    redirectUri: 'https://dashdesk.azurewebsites.net/callback'
};


exports.subscriptionConfiguration = {
    changeType: "Created, Deleted",
    notificationUrl: "https://dashdesk.azurewebsites.net/listen",
    resource: 'me/mailFolders(\'Inbox\')/messages',
    clientState: 'cLIENTsTATEfORvALIDATION'
};

