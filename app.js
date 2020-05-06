const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const path = require('path');


const app = express();


//passport config 
require('./config/passport') (passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to mongo
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// //Ecpress Handler bars
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// public static Folders

//app.use('/public', express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public')));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//Boday Parser
app.use(express.urlencoded({extended: false}));


//Express Session 
app.use(session( { 
    secret: 'secret',
    resave:true,
    saveUninitialized: true
}));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());


//Connsct Flash
app.use(flash());

//Global Vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
    
    
});

// app.get('/contact', (req, res) => {
//     res.render('contact');
// });
//Routes 
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Server Started at 3000'));
