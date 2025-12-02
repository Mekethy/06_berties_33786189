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

Restricted access in pages:

books/list
books/addbook
books/bookadded
users/list
users/audit
users/logout

I added validation to adding books and the login page, this is to prevent empty or incomplete data being added to the books table and stop empty submissions appearing in the audit entries.

Sanitisation

Sanitised fields include in the login page, adding books, and the search text, this is because you can submit things into these forms. I did not sanitise inputs such as passwords as they need to be hashed , prices as it may turn numbers into unusable strings. 

API + WEATHER

Simple REST API that returns book data in JSON, can get all books in database, find books via keywords, price and sort via name/price.