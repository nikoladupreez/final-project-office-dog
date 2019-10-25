const mongoose = require("mongoose");

const DogManager = new mongoose.Schema({
    dogs: [{type: mongoose.Schema.Types.ObjectId, ref: "dog"}]
});

module.exports = mongoose.model('dogManager', DogManager);

