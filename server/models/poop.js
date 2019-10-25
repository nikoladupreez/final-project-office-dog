const mongoose require("mongoose");

const Poop = new mongoose.Schema({
    added_at: {type: Date, default: Date.now},
    dog: {type: mongoose.Types.ObjectId, ref: "dog"},
    dog_manager: {type: mongoose.Types.ObjectId, ref: "user"} //change this! 
});

module.exports = mongoose.model('poop', Poop);

