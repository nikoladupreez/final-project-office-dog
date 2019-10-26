const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const User = require('../../models/user');
const Dog = require('.../../models/dog');
const Cookie = require('../../models/cookie'); 

// POST route => add new cookies
router.post('/dog/:id/add-cookie', (req, res, next) => {
   Cookie.create({
      quantity: req.body.count,
      dog: mongoose.Types.ObjectId(req.params.id),
      dog_manager: mongoose.Types.ObjectId(req.body.user.id)
   })
   .then((cookie) => {
      return Dog.update({id: req.params.id}, {$push: {cookies: cookie}})
   })
   .catch((err) => res.json(err.message);
 });
  
module.exports = router;