// @desc: Handling different client states  logic implementation 
// @note: Lots of moving parts, just store the subscription instance.
// @todo: export an object of database executions instead 
module.exports = function (mongoose, userData, type) {
    
    var notification = require("./db.js");

    var newNotification = new notification({
        subscription: [userData]
    });
    
    // New subscription 
    newNotification.save(function (error) {
        if (!error) {
            console.log("No error writing database .");
        } else {
            console.log("Error writing database .");
        }
    });
    
    // @todo: we just need to store .
    //// Query subscription details 
    //subscription.find({ "email": "john:yahoo.com" }, function (error, subscriptionList) {
    //    if (!error) {
    //        console.dir("Hurray ! data: "+ subscriptionList);
    //    } else {
    //        console.dir("Error quering database. ");
    //    }
    //});
    

    // Updating subscription details .
    //subscription.findOne({ "user": "username" }, function (err, subscriptionDetails) {
    //    if (!err) {
    //        subscriptionDetails.save(function (error) {
    //            if (!error) {
    //                console.dir("Subscription details updated .");
    //            } else {
    //                console.dir("Subscription details updating failed "+error);
    //            }
    //        });
       
    //    } else {
    //        console.dir("Error record not found , creating one ...");
    //    }
    //});


         
}
