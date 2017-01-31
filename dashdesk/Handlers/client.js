
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    subscriptionId: String,
    accessToken: [],
    clientDetails: []
});

var client = mongoose.model("clients", ClientSchema);

module.exports = client;
