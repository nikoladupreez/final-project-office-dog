const mongoose = require("mongoose");

const Dog = new mongoose.Schema({
    name: String, 
    breed: {type: String, default: "Unknown"},
    birthday: {type: String, default: "Unknown"},
    gender: String, 
    avatar: String, 
    food_info: {
        brand: String,
        frequency: Number,
        grams: Number,
        human: String,
    },
    walk_info: {
        avg_frequency: Number,
        avg_km: Number,
        avg_minutes: Number
    },
    poop_avg_frequency: Number,
    cookies_avg_frequency: Number,
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
        company: String, 
        phone: String
    },
    commands: [{type: mongoose.Schema.Types.ObjectId, ref: "command"}],
    english: Boolean,
    walks: [{type: mongoose.Schema.Types.ObjectId, ref: "walk"}],
    cookies: [{type: mongoose.Schema.Types.ObjectId, ref: "cookie"}],
    poops: [{type: mongoose.Schema.Types.ObjectId, ref: "poop"}],
    owner: {type: mongoose.Types.ObjectId, ref: "user"},
    dog_managers: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}]
},
{
    timestamps: true
});

module.exports = mongoose.model('dog', Dog);

