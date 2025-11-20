# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

# Hashed password and inserted? 
INSERT INTO users (username, first, last, email, hashedPassword)
VALUES ('gold', 'Gold', 'User', 'gold@example.com', '$2b$10$ZiET3ZoknocxcGGGzPWRDe33B.2p7C9J8DJ2O0ypHpYUUM9BXvKRi');

# Not hashed password and inserted?
# INSERT INTO users (username, first, last, email, hashedPassword)
# VALUES ('gold', 'Gold', 'User', 'gold@example.com', 'smiths');

