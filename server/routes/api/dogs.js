const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');
const Owner = require('../../models/owner');
const Dog = require('../../models/dog');
const Command = require('../../models/command');
const DogManager = require('../../models/dogManager');
const Poop = require('../../models/poop');
const Cookie = require('../../models/cookie');
const Walk = require('../../models/walk');


// GET route => to get all the dogspaces
router.get('/dogs', (req, res, next) => {
  Dog.find()
    .then(allTheDogs => {
      res.json(allTheDogs);
    })
    .catch(err => {
      res.json(err.message);
    })
});

  // GET route => to get all possible commands
router.get('/commands', (req, res, next) => {
  Command.find()
         .then(allTheCommands => {
           res.json(allTheCommands);
         })
         .catch(err => {
           res.json(err.message);
         })
})


// POST route => to create a new dogspace
router.post('/add-dog', (req, res, next) => {
    let commandIds = req.body.commands;
    let commandObjectIds = [];

    if(commandIds) {
      commandIds.forEach((commandId) => {
      commandObjectIds.push(mongoose.Types.ObjectId(commandId))
      });
    }

    let userId = req.body.userId;
    let ownerId = req.body.ownerId;
    if(!userId) res.status(400).json({message: "Owner missing!"})

    Dog.create({
      name: req.body.name,
      breed: req.body.breed,
      birthday: req.body.birthday,
      gender: req.body.gender,
      avatar: req.body.avatar,
      food_info: {
        brand: req.body.foodBrand,
        frequency: req.body.foodFreq,
        grams: req.body.foodGrams,
        human: req.body.foodHuman,
      },
      walk_info: {
        avg_frequency: req.body.walkAvgFreq,
        avg_km: req.body.walkAvgKm,
        avg_minutes: req.body.walkAvgMinutes
      },
      poop_avg_frequency: req.body.poopAvgFreq,
      cookies_avg_frequency: req.body.cookiesAvgFreq,
      ice_1: {
        name: req.body.ice1Name,
        phone: req.body.ice1Phone
      },
      ice_2: {
        name: req.body.ice2Name,
        phone: req.body.ice2Phone
      }, 
      vet: {
        name: req.body.vetName,
        company: req.body.vetCompany,
        phone: req.body.vetPhone
      },
      english: req.body.translate,
      commands: commandObjectIds,
      owner: mongoose.Types.ObjectId(userId),
      })
      .then((dog) => {
        if(!ownerId){
          Owner.create({dogs:[mongoose.Types.ObjectId(dog.id)]})
               .then((owner) => {
                  User.update({_id: mongoose.Types.ObjectId(userId)}, {owner: mongoose.Types.ObjectId(owner.id)})
                      .then((updatedUser) => {
                        res.json(dog);
                      })
                      .catch((err) => res.status(500).json({message: "Something went wrong with updating the user.", error: err}))
               })
               .catch((err) => {
                  res.status(500).json({ message:'Something went wrong with creating the owner.', error: err});
              });   
        } else {
          Owner.updateOne({_id: mongoose.Types.ObjectId(ownerId)}, {$push: {dogs: dog}})
               .then((updatedOwner) => {
                  res.json(dog);
               })
               .catch((err) => {
                  res.status(500).json({ message:'Something went wrong with updating the owner.', error: err});
                })
        }
      })
      .catch((err) => {
          res.status(500).json({message:'Something went wrong with saving the dog to the database.', error: err});
      })
  });

  
  // GET route => to get a specific dogspace
  router.get('/dog/:id', (req, res, next) => {
    Dog.findById(req.params.id)
       .populate('walks')
       .populate('cookies')
       .populate('poops')
       .populate('owner')
       .populate('commands')
       .populate('dog_managers')
       .then(dog => {
          res.json(dog);
       })
       .catch(err => {
          res.json(err.message);
       })
  });


  // POST route => to add managers to specific dogspace
  router.post('/dog/:id/add-managers', (req, res, next) => {
    let usersArray = req.body; //users with managerId populated
    Dog.findById(req.params.id)
       .then((dog) => {
          usersArray.forEach((user) => {
            if(!user.dog_manager){
              DogManager.create({dogs:[mongoose.Types.ObjectId(dog.id)]})
                        .then((manager) => {
                            User.updateOne({_id: user._id}, {dog_manager: mongoose.Types.ObjectId(manager.id)})
                                .then((updatedUser) => {
                                    Dog.updateOne({_id: dog._id}, {$push: {dog_managers: mongoose.Types.ObjectId(user._id)}})
                                       .then((updatedDog) => {
                                          res.json(updatedDog);
                                       })
                                       .catch((err) => res.status(500).json({message: "Something went wrong with updating the dog", error: err}));
                                })
                                .catch((err) => res.status(500).json({message: "Something went wrong with updating the user.", error: err}));
                        })
                        .catch((err) => res.status(500).json({ message:'Something went wrong with creating the dogmanager.', error: err}));   
            } else {
              DogManager.updateOne({_id: user.dog_manager._id}, {$push: {dogs: dog}})
                   .then((updatedManager) => {
                        Dog.updateOne({_id: dog._id}, {$push: {dog_managers: mongoose.Types.ObjectId(user._id)}})
                           .then((updatedDog) => {
                              res.json(updatedDog);
                           })
                           .catch((err) => res.status(500).json({message: "Something went wrong with updating the dog", error: err}));
                   })
                   .catch((err) => {
                      res.status(500).json({ message:'Something went wrong with updating the dogmanager.', error: err});
                    })
            }
          })
       })
       .catch((err) => {
          res.status(500).json({message: "Something went wrong with finding the dog in the database.", error: err});
       })
  })

  // POST route => edit dog profile
router.post('/dog/:id/profile-edit', (req, res, next) => {
  Dog.updateOne({_id: req.params.id}, {
      name: req.body.name,
      breed: req.body.breed,
      birthday: req.body.birthday,
      gender: req.body.gender,
      avatar: req.body.avatar,
    })
    .then((dog) => {
      res.json(dog);
    })
    .catch((err) => {
        res.status(500).json({message:'Something went wrong with saving the dog to the database.', error: err});
    })
});



  module.exports = router;

