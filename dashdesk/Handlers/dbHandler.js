// @Desc: Database operations logic .

module.exports = {
    
    FindClient : function (mongoose, data, client, callback) {
        
        //@todo: what would be the perfect unique identifier for a client ?
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
    InstallClient : function (mongoose, data,id,token, client, callback) {
        
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
        
        client.findOne({ "user": "username" }, function (err, clientList) {
            if (!err) {
                clientList.save(function (error) {
                    if (!error) {
                        console.dir("Subscription details updated .");
                        callback(clientList);
                    } else {
                        console.dir("Subscription details updating failed " + error);
                        callback(null);
                    }
                });
        
            } else {
                console.dir("Error record not found , creating one ...");
            }
        });

    },
    UpdateSubscription : function (mongoose, data, client, callback) {
        
        client.findOne({ "subscriptionId": data.subscriptionId }, function (err, subscriptionDetails) {
            if (!err) {
                subscriptionDetails.save(function (error) {
                    if (!error) {
                        console.dir("Subscription details updated .");
                        callback(subscriptionDetails);
                    } else {
                        console.dir("Subscription details updating failed " + error);
                        callback(null);
                    }
                });
            
            } else {
                console.dir("Error record not found , creating one ...");
            }
        });

    },
    UninstallClient : function (mongoose, data, client) {
        // remove from database 
    },
    GetSubscription : function (qs,mongoose, data, client, callback) {
        
        client.find({ "subscriptionId": data }, function (error, subscriptionDet) {
            if (!error) {
                if(subscriptionDet.length > 0 || 0){
                    console.log("Subscription Found ! ");
                    console.dir(subscriptionDet);
                    console.dir("SubscriptionId:");
                    console.dir(subscriptionDet[0]._doc.accessToken[0].accessToken);
                    // for(var key in qs.parse(subscriptionDet)){ subscriptionDet = key}
                    callback(subscriptionDet[0]._doc.accessToken[0]);
                    callback(subscriptionDet);
                } else {
                    console.dir("Subscription not found !");
                    console.dir(subscriptionDet);
                    callback(null);
                }
            } else {
                console.dir("Error quering database. ");
                callback(null);
            }
        });
    },
    StoreNotification : function (mongoose, newNotifcation, notification) {
        var newNotifcation = new client({
            notificationDetails: [data]
        });
        
        newClient.save(function (error) {
            if (!error) {
                console.log("Success storing notification .");
            } else {
                console.log("Error Storing Notification .");
            }
        });
    }
};

