// @desc: Handling different client states  logic implementation 
// @note: Lots of moving parts, just store the subscription instance.
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var subscriptionSchema = new Schema({
    tenantId: String,
    fullNames: String,
    email: String,
    userAvatar: String,
    clientState: String,
    accessToken: String,
    refreshToken: String,
    subscriptionId: String,
    sessionTokenKey: String
});



var subscription = mongoose.model("subscriptions", subscriptionSchema);


module.exports = subscription;
