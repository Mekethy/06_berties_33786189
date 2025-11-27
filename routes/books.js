// Create a new router
const express = require("express")
const router = express.Router()
const { redirectLogin } = require('./users');

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

// Lists results from search
router.get('/search-result', function (req, res, next) {
    let keyword = req.query.search_text;   

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


router.post('/bookadded', redirectLogin, function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 


// Export the router object so index.js can access it
module.exports = router
