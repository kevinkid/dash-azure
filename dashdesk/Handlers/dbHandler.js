// @desc: Handling different client states  logic implementation 
// @note: Lots of moving parts, just store the subscription instance.
// @todo: export an object of database executions instead 
module.exports = function (mongoose,userData,type) {
     
    var Schema = mongoose.Schema;
    
    
    //var subscriptionSchema = new Schema({
    //    email: String,
    //    tenantId: String,
    //    fullNames: String,
    //    userAvatar: String,
    //    clientState: String,
    //    accessToken: String,
    //    refreshToken: String,
    //    subscriptionId: String,
    //    sessionTokenKey: String
    //});
    
    var subscriptionSchema = new Schema({
        subscription : []
    });
    
    console.dir('Mongoose'+mongoose);
    
    var subscription = mongoose.model("subscriptions", subscriptionSchema);

    var newsub = new subscription({
        subscription: [userData]
    });
    
    // New subscription 
    newsub.save(function (error) {
        if (!error) {
            console.log("No error writing database .");
        } else {
            console.log("Error writing database .");
        }
    });
    
    // Query subscription details 
    subscription.find({ "email": "john:yahoo.com" }, function (error, subscriptionList) {
        if (!error) {
            console.dir("Hurray ! data: "+ subscriptionList);
        } else {
            console.dir("Error quering database. ");
        }
    });
    

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
