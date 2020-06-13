const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const router = express.Router();

const User = require('../model/User');
// GET
router.get('/register', (req,res) => {
    res.render('register');
});
// POST FOR REGISTER
router.post('/register', (req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Ism Majburiy Qism').notEmpty();
    req.checkBody('email', 'Email Majburiy Qism').notEmpty();
    req.checkBody('email', 'Notogri Email Kiritildi').isEmail();
    req.checkBody('username', 'Username Majburiy Qism').notEmpty();
    req.checkBody('password', 'Parol Majburiy Qism').notEmpty();
    req.checkBody('password2', 'Parol To\'gri Kelmadi').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors){
        res.render('register',{
            errors:errors
        });
    }else{
        const newUser = new User({
           name: name,
           email: email,
           username: username,
           password: password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    console.log(err)

                newUser.password = hash;
                newUser.save((err) => {
                   if (err)
                       console.log(err)
                   else{
                       req.flash('success', 'Siz Muvaffaqiyatli Ro\'yhatdan O\'tdingiz !');
                       res.redirect('/login');
                   }



                });
            });
        });
    }
});
// GET LOGIN PAGE
router.get('/login', (req,res) => {
    res.render('login');
});
// POST LOGIN PAGE
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// GET LOGOUT PAGE
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success', 'Tizimdan Muvaffaqiyatli Chiqdingiz...')
    res.redirect('/login');
});

module.exports  = router;