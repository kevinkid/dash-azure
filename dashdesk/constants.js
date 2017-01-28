exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  clientID: 'd2d6267b-a005-4146-b79a-a754e5e0def3',
  clientSecret: 'wLPDOaGMOjWtGu9iUzsWsMcOLrXPwNG9uOdswFFQoj0=',
  redirectUri: 'https://dashdesk.azurewebsites.net/callback'
};

// credentails source: [http://dev.office.com/devprogram ]
// new  credentails 
/*
 * clientid: 35abf803-88f0-45fd-87a0-b4ff31069bd3	
 * secret:  52E9C65B93D31911CD6C623EF6B9325FEB216802
 * 
 */
// old credentials 
/*
 *   clientID: 'd2d6267b-a005-4146-b79a-a754e5e0def3',
  * clientSecret: 'wLPDOaGMOjWtGu9iUzsWsMcOLrXPwNG9uOdswFFQoj0=',
 */


exports.subscriptionConfiguration = {
  changeType: "Created, Updated, Deleted",
  notificationUrl: 'https://dashdesk.azurewebsites.net/listen',
  resource: "/me/folders('Inbox')/messages",// me/contacts //('Inbox','Sent Items')
  clientState: 'cLIENTsTATEfORvALIDATION'
};

