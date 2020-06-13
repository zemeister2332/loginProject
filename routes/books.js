const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Book Model chaqirildi
const Book = require('../model/Book');
// User Model chaqirildi
const User = require('../model/User');

// EnsureAuthenticated function
const eA = (req,res,next) => {
    if (req.isAuthenticated()){
        next();
    }else{
        req.flash('danger', 'Siz Royhatdan Otmagansiz !!!!');
        res.redirect('/login');
    }
};

// Book Qoshish routi Get
router.get('/books/add', eA, (req,res) => {
    res.render('add_book', {
        title: 'Kitob Qo\'shish'
    });
});


// Yangi Book Qoshish Post

router.post('/books/add', eA ,(req,res)=>{
    req.checkBody('title', 'Sarlavha Kerakli Qism !!!').notEmpty();
    //req.checkBody('author', 'Yozuvchi Qismi Kerakli !!!').notEmpty();
    req.checkBody('body', 'Body Kerakli Qism !!!').notEmpty();

    // errorla
    let errors = req.validationErrors();

    if (errors){
        res.render('add_book', {
            title: 'Kitob Qo\'shish',
            errors: errors
        })
    }else{
        const book = new Book();
        book.title = req.body.title;
        book.author = req.user._id;
        book.body = req.body.body;

        book.save((err)=>{
            if(err)
                console.log(err);
            else{
                req.flash('success', 'Kitob Muvaffaqiyatli Qo\'shildi...');
                res.redirect('/');
            }
        });
    }


});
// Book sahifa routi
router.get('/book/:id', eA , (req,res) => {
    Book.findById(req.params.id, (err, book) => {
        User.findById(book.author, (err, user) => {
            res.render('book', {
                book: book,
                author: user.name
            });
        });
    });
});

// Bosh ozgartirish Get
router.get('/book/edit/:id', eA , (req,res) => {
    Book.findById(req.params.id, (err, book) => {
        if (book.author !== req.user._id){
            req.flash('danger', 'Ochirib tashlash uchun huquqingiz yoq');
            res.redirect('/');
        }

        res.render('book_edit', {
            title: 'Kitobni O\'zgartirish',
            book: book
        });
    });
});

// Book ozgartrsh
router.post('/book/edit/:id', eA , (req,res) => {
    let book = {};
    book.title = req.body.title;
    book.author = req.body.author;
    book.body = req.body.body;

    let query = {_id: req.params.id};

    Book.update(query, book, (err) => {
        if (err)
            console.log(err)
        else{
            req.flash('warning', 'Kitob Muvaffaqiyatli O\'zgartirildi...');
            res.redirect('/');
        }
    });
});

// Book ochirish

router.delete('/book/:id', eA , (req,res) => {

    if (!req.user._id)
        res.status(500).send();


    let query = {_id:req.params.id};


    Book.findById(req.params.id, (err, book) => {
        if (book.author != req.user._id)
            res.status(500).send();
        else{
            Book.deleteOne(query, (err) => {
                if (err)
                    console.log(err)

                res.send('Success');
            });
        }
    });


});


module.exports = router;