const mongoose = require("mongoose");

const Poop = new mongoose.Schema({
    added_at: {type: Date, default: new Date()},
    quantity: Number,
    dog: {type: mongoose.Types.ObjectId, ref: "dog"},
    dog_manager: {type: mongoose.Types.ObjectId, ref: "user"}
});

module.exports = mongoose.model('poop', Poop);

