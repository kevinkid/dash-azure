// @Desc: Database operations logic .

module.exports = {

    FindClient : function (mongoose, data, client, callback){

        //@todo: what would be the perfect unique identifier for a client ?
        client.find({ "subscriptionId": data.subscriptionId }, function (error, clientDet) {
            if (!error) {
                callback(clientDet[0]);
                return clientDet;
                console.dir("Hurray ! data: "+ clientDet);
            } else {
                console.dir("Error quering database. ");
            }
        });

    },
    InstallClient : function(mongoose, data, client){

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
    UpdateClient : function(mongoose,key, value, client, callback){

        client.findOne({ "user": "username" }, function (err, clientList) {
        if (!err) {
            clientList.save(function (error) {
                if (!error) {
                    console.dir("Subscription details updated .");
                    callback(clientList);
                } else {
                    console.dir("Subscription details updating failed "+error);
                    callback(null);
                }
            });
        
        } else {
            console.dir("Error record not found , creating one ...");
        }
        });

    },
    UpdateSubscription : function(mongoose, data, client, callback){

        client.findOne({ "subscriptionId": data.subscriptionId }, function (err, subscriptionDetails) {
            if (!err) {
                subscriptionDetails.save(function (error) {
                    if (!error) {
                        console.dir("Subscription details updated .");
                        callback(subscriptionDetails);
                    } else {
                        console.dir("Subscription details updating failed "+error);
                        callback(null);
                    }
                });
            
            } else {
                console.dir("Error record not found , creating one ...");
            }
        });

    },
    UninstallClient : function(mongoose, data, client){
        // remove from database 
    },
    GetSubscription : function (mongoose, data, client, callback){

        client.find({ "email": "john:yahoo.com" }, function (error, subscriptionDet) {
        if (!error) {
            console.dir("Hurray ! data: "+ subscriptionDet);
            callback(subscriptionDet);
        } else {
            console.dir("Error quering database. ");
            callback(null);
        }
        });

    }
};

