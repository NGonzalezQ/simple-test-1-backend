# Simple Node JS Backend

This project runs a simple Node app with a SQLite Database in order to show a list of products.
The Database generates a list of 11 products.

There are 3 endpoints available: Search all, search by id, search by text.

Search all: Returns all the products from the Database.
Search by id: Returns one product where the id matches.
Search by text: Returns results according to a partial text match in certain fields.

There is also a special condition applied in the searches, if the search query is a palindrome, the price returned has a 20% discount.

By default the service runs on [http://localhost:8000]
