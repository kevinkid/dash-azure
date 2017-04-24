
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    notificationDetails: []
});

var notification = mongoose.model("notifications", NotificationSchema);

module.exports = notification;
