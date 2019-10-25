const mongoose = require("mongoose");

const Command = new mongoose.Schema({
    commando: String, 
    description: String, 
    pronounce: String, 
    translation: String
});

module.exports = mongoose.model('command', Command);

//how is this set up??