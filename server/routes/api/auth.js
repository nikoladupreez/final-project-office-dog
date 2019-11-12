const express    = require('express');
const router     = express.Router();
const passport   = require('passport');
const bcrypt     = require('bcrypt');
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

const User       = require('../../models/user');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.emailAccount, 
        pass: process.env.emailPassword
    }
});

module.exports = transporter;


// POST route => to create a new user
router.post('/signup', (req, res, next) => {
    const {email, password, name, displayName, phone, avatar} = req.body;
  
    if (!email || !password) {
      res.status(400).json({ message: 'Provide email and password.' });
      return;
    }

    if(password.length < 7){
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes!' });
        return;
    }
  
    User.findOne({ email }, (err, foundUser) => {

        if(err){
            res.status(500).json({message: "Something went wrong with the email-check."});
            return;
        }

        if (foundUser) {
            res.status(400).json({ message: 'Email already in use! Choose another one.' });
            return;
        }
  
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
  
        User.create({
            email:  email,
            password: hashPass,
            name: name,
            display_name: displayName,
            phone: phone,
            avatar: avatar
        })
        .then((user) => {
            // Automatically log in user after sign up
            // .login() here is actually predefined passport method
            req.login(user, (err) => {
                if (err) {
                    res.status(500).json({ message: 'Something went wrong with logging in after signup.' });
                    return;
                }
            
                // Send the user's information to the frontend
                // We can use also: res.status(200).json(req.user);
                res.status(200).json(user);
            })
        })
        .catch((err) => {
            res.status(400).json({ message: 'Something went wrong with saving the user to database.', error: err });
        })
    });
});


// POST route => to log a user in 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating the user' });
            return;
        }
    
        if (!user) {
            res.status(401).json(failureDetails);
            return;
        }

        // save user in session
        req.login(user, (err) => {
            if (err) {
                res.status(500).json({ message: 'Something went wrong with saving the session.' });
                return;
            }

            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(user);
        });
    })(req, res, next);
});


// POST route => to check if a user is logged in 
router.get('/loggedin', (req, res, next) => {
    // req.isAuthenticated() is defined by passport
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});


// POST route => to log a user out
router.post('/logout', (req, res, next) => {
    // req.logout() is defined by passport
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});


module.exports = router;

//POST route => get reset link
router.post('/get-reset-link', (req, res, next) => {
    debugger;
    User.findOne({email: req.body.email})
    .then((user) =>{
        jwt.sign({email: user.email}, process.env.jwtSecret, { expiresIn: 60 * 60 }, function(err, token){
            transporter.sendMail({
                from: '"Dogspace" <dogspace.ironhack@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Reset your password ✔', // Subject line
                text: 'Reset password', // plain text body
                html: `<b>Click to reset password for Dogspace: <a href="${process.env.resetPasswordLink}?token=${token}">Reset Link</a></b>` // html body
            })
            .then(()=> {
                res.redirect("/reset-link-confirm");
            })
            .catch((err)=> {
                res.status(400).json({ message: 'Something went wrong with sending the email.', error: err });
            })
        })  
    })
    .catch((err)=> {
        res.status(400).json({ message: 'Something went wrong with finding the user in the database.', error: err });
    })
})