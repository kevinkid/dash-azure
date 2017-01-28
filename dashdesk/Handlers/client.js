
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    sessionKey: String
});

var client = mongoose.model("clients", ClientSchema);

module.exports = client;

