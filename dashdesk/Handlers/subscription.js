
var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var subscriptionSchema = new Schema({
    subscription : []
});


var subscription = mongoose.model("subscriptions", subscriptionSchema);

module.exports = subscription;

