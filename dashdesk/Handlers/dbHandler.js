//: @Desc: Database operation logic .

module.exports = {

    FindClient : function (mongoose, data, client, callback){

        //@todo: what would be the perfect unique identifier for a client ?
        client.find({ "email": "john:yahoo.com" }, function (error, clientDet) {
        if (!error) {
            //@todo: process the clientDet
            callback(clientDet);
            return clientDet;
            console.dir("Hurray ! data: "+ clientDet);
        } else {
            console.dir("Error quering database. ");
        }
        });

    },
    RegisterClient : function(mongoose, data, client){

        var newClient = new client({
            subscription: [data]
        });
        
        newClient.save(function (error) {
            if (!error) {
                return true;
                console.log("No error writing database .");
            } else {
                return false;
                console.log("Error writing database .");
            }
        });

    },
    UpdateClient : function(mongoose,key, value, client){

        client.findOne({ "user": "username" }, function (err, clientList) {
        if (!err) {
            clientList.save(function (error) {
                if (!error) {
                    return true;
                    console.dir("Subscription details updated .");
                } else {
                    return false;
                    console.dir("Subscription details updating failed "+error);
                }
            });
        
        } else {
            console.dir("Error record not found , creating one ...");
        }
        });

    },
    UnregisterClient : function(mongoose, data, client){},
    GetSubscription : function (mongoose, data, subscription){

        subscription.find({ "email": "john:yahoo.com" }, function (error, subscriptionDet) {
        if (!error) {
            return subscriptionDet;
            console.dir("Hurray ! data: "+ subscriptionDet);
        } else {
            return false;
            console.dir("Error quering database. ");
        }
        });

    },
    UpdateSubscription : function(mongoose, data, subscription){

        subscription.findOne({ "user": "username" }, function (err, subscriptionDetails) {
        if (!err) {
            subscriptionDetails.save(function (error) {
                if (!error) {
                    console.dir("Subscription details updated .");
                } else {
                    console.dir("Subscription details updating failed "+error);
                }
            });
        
        } else {
            console.dir("Error record not found , creating one ...");
        }
        });

    },
    StoreSubscription  : function(mongoose, data, subscription){

        var newSubscription = new subscription({
            subscription: [data]
        });
        
        newSubscription.save(function (error) {
            if (!error) {
                return true;
                console.log("No error writing database .");
            } else {
                return false;
                //@todo: implement log for retries .
                console.log("Error writing database .");
            }
        });

    },
    Unsubscribe : function(mongoose, data){}
};

