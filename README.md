# hybr1d-Backend

## Steps to start the app

1. Fork this repository 
2. Clone this repository
3. Add Env file which has been added in the mail
4. In Command line enter the command "npm install" to download all the packages
5. Use "npm start" OR "nodemon index.js" OR "node index.js" to start the app


### Buyer Routes AND Seller Routes

Note : All the buyer routes and seller routes are protected routes.

1. First login or register to get the token 
2. Use the token to hit a call to api
3. Buyer can only access their routes specified in the assignment using their token , they can't access seller's routes.
4. Seller can only access their routes specified in the assignment using their token , they can't access buyer's routes.


### CHANGES 
1. Catalog gets created when a seller creates an account.
2. Replaced "/create-catalog" of seller route with "/add-product" to add products to his/her catalog.
