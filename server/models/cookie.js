const mongoose = require("mongoose");

const Cookie = new mongoose.Schema({
    added_at: {type: Date, default: Date.now()}, 
    quantity: Number, 
    dog: {type: mongoose.Types.ObjectId, ref: "dog"},
    dog_manager: {type: mongoose.Types.ObjectId, ref: "user"} 
});

module.exports = mongoose.model('cookie', Cookie);

