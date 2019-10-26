const mongoose = require("mongoose");

const User = new mongoose.Schema({
    email: {
        type: String, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address!'],
        required: [true, "Please enter your email!"]
    },
    password: {type: String, required: [true, "Please enter a password!"]},
    firstname: {type: String, required: [true, "Please enter your first name!"]},
    lastname : {type: String, required: [true, "Please enter your last name!"]},
    display_name: String, 
    phone: {
        type: String, 
        match:  [/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/, 
                'Please enter a valid phone number!'], 
        required: [true, "Please enter your phone number!"]
    },
    image_URL: {type: String, default: "./images/default"}, //change the default! front-end should also be able to find
    owner: {type: mongoose.Types.ObjectId, ref: "owner"}, 
    dog_manager: {type: mongoose.Types.ObjectId, ref: "dogManager"}
},
{
    timestamps: true
});

module.exports = mongoose.model('user', User);

