const mongoose require("mongoose");

const Walk = new mongoose.Schema({
    added_at: {type: Date, default: Date.now},
    time_seconds: Number,
    distance_meters: Number,
    dog: {type: mongoose.Types.ObjectId, ref: "dog"},
    dog_manager: {type: mongoose.Types.ObjectId, ref: "user"}, //change this
    poops: [{type: mongoose.Types.ObjectId, ref: "poop"}]
});

module.exports = mongoose.model('walk', Walk);

//can you also save an image of the route?