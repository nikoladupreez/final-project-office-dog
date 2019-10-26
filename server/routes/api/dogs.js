const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');
const Owner = require('../../models/owner');
const Dog = require('../../models/dog');
const Command = require('../../models/command');
const DogManager = require('../../models/dogManager');


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
    commandIds.forEach((commandId) => {
      commandObjectIds.push(mongoose.Types.ObjectId(commandId))
    });

    Dog.create({
        name: req.body.name,
        breed: req.body.breed,
        birthday: req.body.birthday,
        gender: req.body.gender,
        // avatar: req.body.avatar,
        food_info: {
          brand: req.body.foodBrand,
          frequency: req.body.foodFreq,
          grams: req.body.foodGrams,
          human: req.body.foodHuman,
          dangerous: req.body.foodDanger 
        },
        walk_info: {
          avg_frequency: req.body.walkAvgFreq,
          avg_km: req.body.walkAvgKm,
          avg_minutes: req.body.walkAvgMinutes
        },
        poop_avg_frequency: req.body.poopAvgFreq,
        cookies_avg_frequency: req.body.cookiesAvgFreq,
        chip_number: req.body.chipNumber,
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
          phone: req.body.vetPhone
        },
        commands: commandObjectIds,
        owner: mongoose.Types.ObjectId(req.user.id),
        })
        .then(dog => {
          res.json(dog);
        })
        .catch(err => {
          res.json(err.message);
        })
  });


  // GET route => to get a specific dogspace
  router.get('/dog/:id', (req, res, next) => {
    Dog.findById(req.params.id)
       .populate('dog_managers', 'owner', 'cookies', 'walks', 'poops', 'commands')
       .then(dog => {
          res.json(dog);
       })
       .catch(err => {
          res.json(err.message);
       })
  });


  const createDogManager = async () => {
    return await DogManager.create();
  }

  // POST route => to add managers to specific dogspace
  router.post('/dog/:id/add-managers', (req, res, next) => {
    let usersArray = req.body; //users with managerId populated

    Dog.findById(req.params.id)
       .then((dog) => {
          usersArray.forEach((user) => {
            if(!user.dog_manager){
              user.dog_manager = createDogManager();
            } 

            DogManager.update({id: user.dog_manager.id}, {$push: {dogs: dog}})
                      .then((manager) => {
                         Dog.update({id: dog.id}, {$push: {dog_managers: user}})
                            .catch((err) => res.json(err.message));
                      })
                      .catch((err) => res.json(err.message));
          })
       })
  })


  module.exports = router;