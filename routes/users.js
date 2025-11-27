// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

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




router.post('/registered', function (req, res, next) {

    const saltRounds = 10
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {

        // Store things in database
        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)"
        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ]

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err)
            }

            // Output the password and hashed password
            let output = 'Hello ' + req.body.first + ' ' + req.body.last +
                         ' you are now registered!  We will send an email to you at ' + req.body.email + '. '
            output += 'Your password is: ' + req.body.password +
                      ' and your hashed password is: ' + hashedPassword

            res.send(output)
        })

    })
})

router.post('/loggedin', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    // Look for user
    let sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return next(err);
            
        }

        // If user doesnt get found
        if (result.length === 0) {
            let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
            db.query(auditQuery, [username, false]);

            return res.send("Login failed: username not found.");
        }

        // Find hashed password
        let storedHash = result[0].hashedPassword;

        // Compare using bcrypt
        bcrypt.compare(password, storedHash, function(err, match) {

            let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
            db.query(auditQuery, [username, match]);

            // Check if password is same or not
            if (match) {
                let message = "Login successful! Welcome back, " + result[0].first + " " + result[0].last;
                req.session.userId = req.body.username;
                res.send(message);
            } else {
                res.send("Login failed: incorrect password.");
            }
        });
    });
});

// Export the router object so index.js can access it
module.exports = { router, redirectLogin };