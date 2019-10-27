const mongoose = require("mongoose");

const Poop = new mongoose.Schema({
    added_at: {type: Date, default: new Date()},
    dog: {type: mongoose.Types.ObjectId, ref: "dog"}
});

module.exports = mongoose.model('poop', Poop);

