const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');
const Dog = require('../../models/dog');
const Poop = require('../../models/poop'); 

// POST route => add new cookies
router.post('/dog/:id/add', (req, res, next) => {
   debugger;
   Poop.create({
      quantity: req.body.poopCount,
      dog: mongoose.Types.ObjectId(req.params.id),
      dog_manager: mongoose.Types.ObjectId(req.body.user._id)
   })
   .then((poop) => {
         Dog.update({_id: req.params.id}, {$push: {poops: poop}})
            .then((dog) => {
               res.json(dog);
            })
            .catch((err) => res.status(500).json({message: 'Something went wrong with updating the dog', error: err}));
   })
   .catch((err) => res.status(500).json({message: 'Something went wrong with creating the cookies', error: err}));
 });
  
module.exports = router;