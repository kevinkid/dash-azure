﻿// @Desc: Database operations logic .

module.exports = {
    
    findClient : function (mongoose, data, client, callback) {
        
        //@todo: what would be the perfect unique identifier for a client ?
        // TODO: So what do we query here we can't get the subscript again 
        client.find({ "subscriptionId": data.subscriptionId }, function (error, clientDet) {
            if (!error) {
                callback(clientDet[0]); 
                return clientDet;
                console.dir("Hurray ! data: " + clientDet);
            } else {
                console.dir("Error quering database. ");
            }
        });

    },
    InstallClient : function (mongoose, data, id, token, client, callback) {
        
        var newClient = new client({
            subscriptionId: id,
            accessToken: token,
            clientDetails: [data]
        });
        
        newClient.save(function (error) {
            if (!error) {
                console.log("No error writing database .");
                // trial async database operation .
                callback();
            } else {
                console.log("Error writing database .");
                callback(error);
            }
        });

    },
    UpdateClient : function (mongoose, key, value, client, callback) {
        
        client.find({ key: value }, function (err, clientList) {
            if (!err) {
                if(clientList.length > 0){
                    /// Alt : If this doesn't work just change the value and save the document 
                    client.update({"subscriptionId": data.subscriptionId},
                                  {$inc: {visits: 1}},
                                  {multi: false}, function (error,updatedDocs) {
                                    if(!(updatedDocs < 1)) { 
                                        console.log("Databate updated !");
                                        callback();
                                    } else {
                                        console.log('No records updated !');
                                 }
                            }
                        );
                }else {
                    callback(null); // throw a better error .
                }
            } else {
                console.dir("Error record not found , creating one ...");
            }
        });
    },
    UninstallClient : function (mongoose, data, client) {
        // remove from database 
    },
    GetSubscription : function (requestHelper, qs, mongoose, data, client, callback) {
        
        client.find({ "subscriptionId": data }, function (error, subscriptionDet) {
            if (!error) {
                if (subscriptionDet.length > 0 || 0) {
                    console.log("Subscription Found ! ");
                    console.dir(subscriptionDet[0]._doc.accessToken[0]);
                    console.dir("SubscriptionId:");
                    console.dir(subscriptionDet[0]._doc.accessToken[0].accessToken);
                    callback(subscriptionDet[0]._doc.accessToken[0]);
                   
                } else {
                    console.dir("Subscription not found !");
                    console.dir(error);
                    callback(null);
                }
            } else {
                console.dir("Error quering database. ");
                callback(null);
            }
        });
    },
    UpdateSubscription : function (mongoose, data, client, callback) {
        
        client.find({ "subscriptionId": data.subscriptionId }, function (err, subscriptionList) {
            if (!err) {
                /// Alt : If this doesn't work just change the value and save the document 
                client.update({"subscriptionId": data.subscriptionId},
                                {$inc: {visits: 1}},
                                {multi: false}, function (error,updatedDocs) {
                                    if(!(updatedDocs < 1)) { 
                                        console.log("Databate updated !");
                                        callback();
                                    } else {
                                        console.log('No records updated !');
                                 }
                            }
                        );
            
            } else {
                console.dir("Error record not found , creating one ...");
            }
        });
    },
    StoreNotification : function (mongoose, notification, client) {
        var newNotifcation = new client({
            notificationDetails: [notification]
        });
        
        newNotifcation.save(function (error) {
            if (!error) {
                console.log("Success storing notification .");
            } else {
                console.log("Error Storing Notification .");
            }
        });
    }
};

