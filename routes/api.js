// Create a new router
const express = require('express');
const router = express.Router();

// Books API, sql queries with parameters to sort and filter
router.get('/books', function (req, res, next) {

    // Read parameters
    let keyword = req.query.search;
    let minPrice = req.query.minprice;
    let maxPrice = req.query.max_price;
    let sort = req.query.sort;

    // Start base query
    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

    // Searching for keywords
    if (keyword) {
        sqlquery += " AND name LIKE ?";
        params.push("%" + keyword + "%");
    }

    // Searching for prices
    if (minPrice) {
        sqlquery += " AND price >= ?";
        params.push(minPrice);
    }

    if (maxPrice) {
        sqlquery += " AND price <= ?";
        params.push(maxPrice);
    }

    // Sorting books
    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    }
    else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    // Execute the query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        } else {
            res.json(result);
        }
    });

});



// export the router so index.js can load it
module.exports = router;
