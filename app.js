const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
// mongodb connection -----------------------------------
mongoose.connect(config.database,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;

db.once('open', () => {
    console.log("Mongo DB bog'landi");
});
db.on('error', (err) => {
    console.log(err)
});
// mongo db close ----------------------------------------
// express chaqiridi
const app = express();

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Model chaqirildi
const Book = require('./model/Book');

// static folderla
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// public set static
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

// passport init
require('./config/passport')(passport);
// passport midd
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

// Bosh Sahifa
app.get('/', (req,res) => {
      Book.find({}, (err, books) => {
        if (err){
            console.log(err)
        }else{
            res.render('index', {
                title: 'Kitoblar',
                books: books
            })
        }
    });

});

const books = require('./routes/books');
app.use('/', books);
const users = require('./routes/user');
app.use('/', users);

app.listen(3000, () => {
    console.log("Server ishga tushdi !!!");
});