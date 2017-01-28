
var mongoose = require("mongoose");

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

var notificationSchema = new Schema({
    notification: []
});



var subscription = mongoose.model("subscriptions", subscriptionSchema);
var notification = mongoose.model("notifications", notificationSchema);

// @note: modules can only export one at a time otherwise use an object . 
module.exports = subscription;


