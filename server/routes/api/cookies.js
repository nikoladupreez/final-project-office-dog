const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');
const Dog = require('.../../models/dog');
const Cookie = require('../../models/cookie'); 

// GET route => to get all the cookies of a dog of today
router.get('/dog/:id', (req, res, next) => {
  Dog.findById({id: req.params.id})
     .populate('cookies')
     .then(dog => {
        res.json(dog);
     })
     .catch(err => {
        res.json(err.message);
     })
});
  
module.exports = router;