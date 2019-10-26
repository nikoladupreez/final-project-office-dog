const mongoose = require("mongoose");

const Owner = new mongoose.Schema({
    dogs: [{type: mongoose.Schema.Types.ObjectId, ref: "dog"}]
});

module.exports = mongoose.model('owner', Owner);

