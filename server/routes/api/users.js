const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');

// GET route => to get user by email and populate with manager
router.get('/email/:email', (req, res, next) => {
    User.findOne({email: req.params.email})
        .populate({
          path: 'dog_manager',
          populate: {
                      path: 'dogs'
                    }
        })
        .then(user => {
          if(user === null){
            res.status(404).json({message: 'User not found'});
          } else {
            res.json(user);
          }
        })
        .catch(err => {
          res.json(err.message);
        })
  });

// GET route => to get session user and populate
router.get('/:id', (req, res, next) => {
  User.findById(req.params.id)
      .populate({
          path: 'owner',
          populate: {
                      path: 'dogs'
                    }
        })
        .populate({
          path: 'dog_manager',
          populate: {
                      path: 'dogs'
                    }
        })
        .then(user => {
          res.json(user);
        })
        .catch(err => {
          res.json(err.message);
        })
});

// POST route => edit user info
router.post('/:id/edit', (req, res, next) => {
  User.update({id: req.params.id}, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        display_name: req.body.display,
        phone: req.body.phone
        // image_URL:
      })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        res.json(err.message);
      })
});

  module.exports = router;