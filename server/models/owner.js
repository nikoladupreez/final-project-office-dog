const mongoose = require("mongoose");

const Owner = new mongoose.Schema({
    dogs: [{type: mongoose.Schema.Types.ObjectId, ref: "dog"}],
    invites: [{type: mongoose.Schema.Types.ObjectId, ref: "invitee"}],
    dog_managers: [{type: mongoose.Schema.Types.ObjectId, ref: "dogManager"}]
});

module.exports = mongoose.model('owner', Owner);

