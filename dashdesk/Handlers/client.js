
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    clientDetails: []
});

var client = mongoose.model("clients", ClientSchema);

module.exports = client;
