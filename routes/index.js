const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


//Home page 
router.get('/', (req, res) =>  res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => 
 res.render('dashboard' , {
     name: req.user.name,
     email: req.user.email,
     password: req.user.password
 }

 ));






module.exports = router;