// @desc: Handling different client states  logic implementation 
// @note: Lots of moving parts, just store the subscription instance.
// @todo: export an object of database executions instead 
module.exports = function (mongoose,userData,type) {
     
    var Schema = mongoose.Schema;

    var subscriptionSchema = new Schema({
        notificationData: []
    });

    var notificationSchema = new Schema({
        subscription : []
    });
    
    
    console.dir('Mongoose'+mongoose);
    
    
    var subscription = mongoose.model("subscriptions", subscriptionSchema);
    var notification = mongoose.model("notifications", notificationSchema);

  


         var notificationhub = new notification({ 
             notificationData: [userData]
         });
    



  // newsubcription
    var newsubcription = new subscription({
        subscription: [userData]
    });

    function FindSubscription(subData) {
                       
        // @todo: Query subscription details  using mongoose 
        subscription.find({"subscriptionId": subData}, function (error, subscriptionList) {
            if (!error) {
                console.dir("Hurray ! data: " + subscriptionList);
            } else {
                console.dir("Error quering database. ");
            }
        });
            
    }
    
    

    // stores the subscription as well 
    function StoreUser() {



        // New subscription 
        newsubcription.save(function (error) {
            if (!error) {
                console.log("No error writing database .");
            } else {
                console.log("Error writing database .");
            }
        });
            
    }
            
    
    function FindUser() {
        
        // Updating subscription details .
        subscription.findOne({ "user": "username" }, function (err, subscriptionDetails) {
            if (!err) {
                console.dir("User found, updating subscription details details ");
                subscriptionDetails.key = "New value";
                subscriptionDetails.save(function (error) {
                    if (!error) {
                        console.dir("Subscription details updated .");
                    } else {
                        console.dir("Subscription details updating failed " + error);
                    }
                });
       
            } else {
                console.dir("Error record not found , creating one ...");
            }
        });
        
    }
    
    function updateUser(data) {
         // Updating subscription details .
    // subscription.findOne({ "user": "username" }, function (err, subscriptionDetails) {
    //     if (!err) {
    //         subscriptionDetails.save(function (error) {
    //             if (!error) {
    //                 console.dir("Subscription details updated .");
    //             } else {
    //                 console.dir("Subscription details updating failed "+error);
    //             }
    //         });
       
    //     } else {
    //         console.dir("Error record not found , creating one ...");
    //     }
    // });   
    }
    

    function StoreNotification() {
    

         notificationhub.save(function (err) {
             if (!err) {
                 console.dir("Notification stored .");
             } else {
                 console.dir("Storing notification failed .");
             }
         });
                
    }

      // (type === "storeUser")? StoreUser():StoreNotification(); 
      (type === "storeUser")? StoreNotification():StoreUser(); 

}
