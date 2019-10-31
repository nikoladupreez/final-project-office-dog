const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');
const Dog = require('../../models/dog');
const Walk = require('../../models/walk'); 

// POST route => add new cookies
router.post('/dog/:id/add', (req, res, next) => {
   Walk.create({
      time_seconds: req.body.seconds,
      distance_meters: req.body.meters,
      path: req.body.path,
      dog: mongoose.Types.ObjectId(req.params.id),
      dog_manager: mongoose.Types.ObjectId(req.body.user._id),
      poops: req.body.poopCount
   })
   .then((walk) => {
         Dog.update({_id: req.params.id}, {$push: {walks: walk}})
            .then((dog) => {
               res.json(dog);
            })
            .catch((err) => res.status(500).json({message: 'Something went wrong with updating the dog', error: err}));
   })
   .catch((err) => res.status(500).json({message: 'Something went wrong with creating the cookies', error: err}));
 });
  
module.exports = router;