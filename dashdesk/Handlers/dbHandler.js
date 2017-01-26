// @desc: Handling different client states  logic implementation 
// @note: Lots of moving parts, just store the subscription instance.
// @todo: export an object of database executions instead 
module.exports = function (mongoose) {
     
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
        email: String,
        subscriptionId : String
    });
    
    console.dir('Mongoose'+mongoose);
    
    var subscription = mongoose.model("subscriptions", subscriptionSchema);

    var newsub = new subscription({
        email: "anotheruser:yahoo.com",
        subscriptionId: "asdfasdfasdfa-sdjfa-sdd8f"
    });

    newsub.save(function (error) {
        if (!error) {
            console.log("No error writing database .");
        } else {
            console.log("Error writing database .");
        }
    });

    subscription.find({ "email": "john:yahoo.com" }, function (error, subscriptionList) {
        if (!error) {
            console.dir("Hurray ! data: "+ subscriptionList);
        } else {
            console.dir("Error quering database. ");
        }
    });
         
}
