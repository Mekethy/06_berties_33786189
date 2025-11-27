// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }

        res.render("listusers.ejs", { users: result });
    });
});

router.get('/login', function(req, res, next) {
    res.render("login.ejs");
});

router.get('/audit', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM audit ORDER BY timestamp DESC";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        res.render("audit.ejs", { audits: result });
    });
});

router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');  
        }
        res.send("You are now logged out. <a href='/'>Home</a>");
    });
});




router.post(
    '/registered',
    [
        check('email')
            .notEmpty().withMessage('Email cannot be empty')
            .isEmail().withMessage('Email must be a valid email'),

        check('username')
            .notEmpty().withMessage('Username cannot be empty')
            .isLength({ min: 5, max: 20 }).withMessage('Username must be 5–20 characters'),

        check('first')
            .notEmpty().withMessage('First name cannot be empty'),

        check('last')
            .notEmpty().withMessage('Last name cannot be empty'),

        check('password')
            .notEmpty().withMessage('Password cannot be empty')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    ],

    function (req, res, next) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('register', { errors: errors.array() });
        }

        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {

            // Store things in database
            let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
            let newrecord = [
                req.sanitize(req.body.username),
                req.sanitize(req.body.first),
                req.sanitize(req.body.last),
                req.sanitize(req.body.email),
                hashedPassword
            ];


            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return next(err);
                }

                // Output the password and hashed password
                let output = 'Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) +
                    ' you are now registered!  We will send an email to you at ' + req.sanitize(req.body.email) + '. ';

                output += 'Your password is: ' + req.sanitize(req.body.password)     +
                ' and your hashed password is: ' + hashedPassword;

                res.send(output);
            });

        });
    }
);


router.post(
    '/loggedin',
    [
        check('username')
            .notEmpty().withMessage('Username cannot be empty')
            .trim(),

        check('password')
            .notEmpty().withMessage('Password cannot be empty')
    ],
    function(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send("Login error:<br>" + JSON.stringify(errors.array()));
        }

        let username = req.sanitize(req.body.username);
        let password = req.body.password;

        let sqlquery = "SELECT * FROM users WHERE username = ?";
        db.query(sqlquery, [username], (err, result) => {
            if (err) return next(err);

            if (result.length === 0) {
                let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
                db.query(auditQuery, [username, false]);
                return res.send("Login failed: username not found.");
            }

            let storedHash = result[0].hashedPassword;

            bcrypt.compare(password, storedHash, function(err, match) {

                let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
                db.query(auditQuery, [username, match]);

                if (match) {
                    req.session.userId = username;
                    res.send("Login successful! Welcome back, " +
                             result[0].first + " " + result[0].last);
                } else {
                    res.send("Login failed: incorrect password.");
                }
            });
        });
    }
);


// Export the router object so index.js can access it
module.exports = { router, redirectLogin };