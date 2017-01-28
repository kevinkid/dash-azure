
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    sessionKey: String
});

var client = mongoose.model("clients", notificationSchema);

module.exports = client;

