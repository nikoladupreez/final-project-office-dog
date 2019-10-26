const mongoose = require("mongoose");

const Dog = new mongoose.Schema({
    name: String, 
    breed: {type: String, default: "Unknown"},
    birthday: {type: String, default: Date.now().toString()},
    gender: String, 
    avatar: String, 
    food_info: {
        brand: String,
        frequency: Number,
        grams: Number,
        human: String,
        dangerous: Array
    },
    walk_info: {
        avg_frequency: Number,
        avg_km: Number,
        avg_minutes: Number
    },
    poop_avg_frequency: Number,
    cookies_avg_frequency: Number,
    chip_number: String, 
    ice_1: {
        name: String,
        phone: String
    },
    ice_2: {
        name: String,
        phone: String
    },
    vet: {
        name: String,
        phone: String
    },
    commands: [{type: mongoose.Schema.Types.ObjectId, ref: "command"}],
    walks: [{type: mongoose.Schema.Types.ObjectId, ref: "walks"}],
    cookies: [{type: mongoose.Schema.Types.ObjectId, ref: "cookies"}],
    poops: [{type: mongoose.Schema.Types.ObjectId, ref: "poops"}],
    owner: {type: mongoose.Types.ObjectId, ref: "user"},
    dog_managers: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}]
});

module.exports = mongoose.model('dog', Dog);

