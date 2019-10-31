const mongoose = require("mongoose");

const Walk = new mongoose.Schema({
    added_at: {type: Date, default: new Date()},
    time_seconds: Number,
    distance_meters: Number,
    path: [Array],  //Array with coordinates
    dog: {type: mongoose.Types.ObjectId, ref: "dog"},
    dog_manager: {type: mongoose.Types.ObjectId, ref: "user"}, 
    poops: Number
});

module.exports = mongoose.model('walk', Walk);

