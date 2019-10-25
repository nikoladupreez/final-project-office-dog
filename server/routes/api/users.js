const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');

// GET route => to get user by email and populate with manager
router.get('/email/:email', (req, res, next) => {
    User.find({email: req.params.email})
        .populate('dog_manager')
        .then(user => {
          res.json(user);
        })
        .catch(err => {
          res.json(err.message);
        })
  });

// GET route => to get session user and populate with dogs
router.get('/:id', (req, res, next) => {
  User.find({id: req.params.id})
      .populate('dogs')
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        res.json(err.message);
      })
});

  module.exports = router;