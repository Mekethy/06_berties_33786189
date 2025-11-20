# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install (bcrypt, express, ejs, dotenv)
node index.js

dotenv

Implemented dotenv module to secure details, moved details to .env file which is then pulled into index.js rather than hardcoding it in index.js, this lets the app access the details without exposing them publicly, .env file is also ignored so it does not get uploaded to github

audit

Implemented audit logging system, new database table created to store name, whether they managed to login and a timestamp, insert query in loggedin rouet to record result of login attempt, new page to display audit history.