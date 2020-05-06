const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
const passport = require('passport');

 
//User Model
const User = require('../model/user');

//Login page 
router.get('/login', (req, res) =>  res.render('login'));

// 
router.get('/contact', (req, res) => res.render('contact'));


//Register Page 
router.get('/register', (req, res) =>  res.render('register'));

//Register Handle
router.post('/register',(req, res) => {
    const { name, email, password, password2 } = req.body; 
    let errors = []

    //check Required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    //Check passwords match
    if(password !==password2){
        errors.push({msg:'Passwords do not match'});
    }
    //Check Password Length
    if(password.length < 6 ){
        errors.push({msg: 'Password should be at least 6 charchtets'});
    }
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });

    }
    else{
        // Validation passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                //user exiss
                errors.push({msg:'Email is already registred'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });

            } else{
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) =>
                 bcrypt.hash(newUser.password, salt, (err, hash ) => {
                     if(err) throw err;

                     newUser.password = hash;

                     //Save user
                     newUser.save()
                       .then(user => {
                           req.flash('success_msg', 'You Are now registred');
                           res.redirect('/users/login');

                       })
                       .catch(err => console.log(err));
                 }))
            }
        });
    }
    
});

//Login Handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);
});

//Logout Handle
router.get('/logout', (req,res) =>{
    req.logOut();
    req.flash('success_msg', 'You Are Logged Out');
    res.redirect('/users/login');
});


module.exports = router;