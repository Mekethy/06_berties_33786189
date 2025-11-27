// Create a new router
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./users');
const { check, validationResult } = require('express-validator');

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

// Lists results from search
router.get('/search-result', function (req, res, next) {
    let keyword = req.sanitize(req.query.search_text);

// Create SQL query (? to prevent sql injection)
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchTerm = '%' + keyword + '%';

// Query the database
    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) {
            return next(err);
        }

// Render + pass results
        res.render("search-result", {
            searchTerm: keyword,
            foundBooks: result
        });
    });
});


router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render('addbook.ejs');
});


// LIST ALL BOOKS
router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        
        // Render list.ejs and pass the result
        res.render("list.ejs", { availableBooks: result })
    });
});

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }

        res.render("bargainbooks.ejs", { cheapBooks: result });
    });
});


router.post(
    '/bookadded',
    redirectLogin,
    [
        check('name')
            .notEmpty().withMessage('Book name cannot be empty')
            .trim(),

        check('price')
            .notEmpty().withMessage('Price cannot be empty')
            .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0')
            .isFloat({ lt: 500 }).withMessage('Price must be below £500')
    ],
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send("Error adding book:<br>" + JSON.stringify(errors.array()));
        }

        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        let newrecord = [req.sanitize(req.body.name), req.body.price];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) next(err);
            else res.send('This book is added to database, name: ' + req.sanitize(req.body.name) + ' price ' + req.body.price);
        });
    }
);



// Export the router object so index.js can access it
module.exports = router
