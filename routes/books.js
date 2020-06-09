const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Book Model chaqirildi
const Book = require('../model/Book');

// Book Qoshish routi Get
router.get('/books/add', (req,res) => {
    res.render('add_book', {
        title: 'Kitob Qo\'shish'
    });
});

// Yangi Book Qoshish Post

router.post('/books/add',(req,res)=>{
    req.checkBody('title', 'Sarlavha Kerakli Qism !!!').notEmpty();
    req.checkBody('author', 'Yozuvchi Qismi Kerakli !!!').notEmpty();
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
        book.author = req.body.author;
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
router.get('/book/:id', (req,res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render('book', {
            book: book
        });
    });
});

// Bosh ozgartirish Get
router.get('/book/edit/:id', (req,res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render('book_edit', {
            title: 'Kitobni O\'zgartirish',
            book: book
        });
    });
});

// Book ozgartrsh
router.post('/book/edit/:id', (req,res) => {
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

router.delete('/book/:id', (req,res) => {
    let query = {_id: req.params.id};

    Book.deleteOne(query, (err) => {
        if (err)
            console.log(err)

        res.send('Success');
    });

});


module.exports = router;