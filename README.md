# Description
An API for user management. It can be used to get, update, create and delete users from a database.

# Technologies used
### The API has been coded using a combination of:
- Javascript
- Express
- Node.js
  
For the database I decided on using MongoDB. It's free and I had some experience writing apps using this database so I think it's a good choice.

### Authentication
The API can be accessed by providing an API key in the request parameters. The API key has to be added into the .env file so that the code can check against it when receiving a request. I added a very simple script that generates a key inside of the project (api_key_gen.js). 

# Instalation

1. Create a new MongoDB project and cluster. 
2. Clone the repository to your local machine:
   ```sh
   git clone https://github.com/Rx-9mw/Exlabs_recruitment_task.git
   ```
3. Install all the packages:
   ```sh
   npm install
   ```
4. Run the api_key_gen.js script to generate a key:
   ```sh
   node api_key_gen.js
   ```
6. Add the .env file into the main catalogue.
7. Insert variables inside of the new .env file:
   ```sh
   DB_URL= #url to your MongoDB cluster, including username and password
   API_PORT= #the port on which you want to run the express server
   API_KEY= #the api key you generated in step 4
   ```
8. Run the application with one of these commands:
   ```sh
   node app.js
   ```
   OR
   ```sh
   npm run dev #starts the server with nodemon, better for making changes to the app
   ```

# Using the API
## Get all users from the database:
Send a GET request to:

```sh
localhost:{Your API_PORT variable)/api/users?API_KEY={the api key you generated in step 4 of installation}
```

The data comes back in an array of objects like this:

```sh
[
  {
    _id: 'idofuser1',
    firstName: 'User1',
    lastName: 'User1 last',
    email: 'user1@user1.com',
    role: 'user',
  },
  {
    _id: 'idofuser2',
    firstName: 'User2',
    lastName: 'User2 last',
    email: 'user2@user2.com',
    role: 'admin',
  },
  ...
]
```

## Get one user from the database:

Send a GET request to:
```sh
localhost:{Your API_PORT variable)/api/user/{id of the user}?API_KEY={the api key you generated in step 4 of installation}
```

The data comes back in a single object like this:
```sh
{
  _id: 'idofuser1',
  firstName: 'User1',
  lastName: 'User1 last',
  email: 'user1@user1.com',
  role: 'user',
},
```

## Add a new user to the database:

Send a POST request to:
```sh
localhost:{Your API_PORT variable)/api/user?API_KEY={the api key you generated in step 4 of installation}
```

Add information for the user into the request body:
```sh
{
  "firstName": "User1", #Optional, defaults to an empty string
  "lastName": "User1 last", #Optional, defaults to an empty string
  "email": "user1@user1.com", #Required, has to be unique
  "role": "admin" #Required, can be either user or admin
}
```

## Update user from the database:

Send a PATCH request to:
```sh
localhost:{Your API_PORT variable)/api/user/{id of the user}?API_KEY={the api key you generated in step 4 of installation}
```

Add information for the update into the request body:
```sh
{
  #At least one property has to be added to the request
  "firstName": "User3", #Optional
  "lastName": "User3 last", #Optional
  "role": "user" #Optional, can be either user or admin
}
```
## Delete a user from the database:

Send a DELETE request to:
```sh
localhost:{Your API_PORT variable)/api/user/{id of the user}?API_KEY={the api key you generated in step 4 of installation}
```







