const mongoose require("mongoose");

const Cookie = new mongoose.Schema({
    added_at: {type: Date, default: Date.now()}, //this is not changed
    quantity: Number, //this or not?
    dog: {type: mongoose.Types.ObjectId, ref: "dog"},
    dog_manager: {type: mongoose.Types.ObjectId, ref: "user"} //change this!
});

module.exports = mongoose.model('cookie', Cookie);

