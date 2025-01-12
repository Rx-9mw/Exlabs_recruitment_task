const express = require('express');
const router = express.Router();
const User = require('../Models/user_model.js');
const {duplicateUserCheck, y} = require('../Middleware/middleware.js');

// Get all users.
router.get('/users', async (req, res) => {
    try {
        // Check if role is specified in the request.
        if(req.query.role) {
            // Check if role is correct.
            if(req.query.role !== 'admin' && req.query.role !== 'user') {
                return res.status(400).send('Users not found, role must be either admin or user.');
            }
            // If role parameter exists find all users with the role and exclude the mongoDB's _id field.
            const users = await User.find({ role: req.query.role }, { _id: 0, __v: 0 });
            res.status(200).send(users);
        } else {
            // Find all users and exclude the mongoDB's _id field.
            const users = await User.find({}, { _id: 0 });
            res.status(200).send(users);
        }
    } catch (error) {
        // If there is an error, send status code 500 and error message
        res.status(500).send('Status code: 500\n Error retrieving users.');
    }
});

// Get user by id.
router.get('/user/:id', async (req, res) => {
    try {
        // Find user and exclude the mongoDB's _id field.
        const user = await User.find({id: req.params.id}, { _id: 0, __v: 0 });
        res.status(200).send(user);
    } catch (error) {
        // If user with the id has not been found, send status code 404 and error message.
        res.status(404).send(`Status code: 404\n User with this id does not exist.`);
    }
});

// Add user to database.
router.post('/user', duplicateUserCheck, async (req, res) => {
    // Check if request body has at least one paremeter of user to change.
    if(!req.body.id || !req.body.email || !req.body.role) {
        return res.status(400).send(`Status code: 400\n Please include required fields (id, email, role).`);
    }
    try {
        /* MongoDB saves empty values as a string with 0 inside it. Because I wanted it to be completely
        empty, I'm overwriting the value with an empty string if first name or last name has not been
        specified in the request. */ 
        req.body.firstName = req.body.firstName || "";
        req.body.lastName = req.body.lastName || "";
        // Creating new user for MongoDB using the model.
        const user = new User({
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
        });
        // Saving the object to the database and sending the response.
        await user.save();
        res.status(201).send(`Status code: 201\n User created successfully.`);
    } catch (error) {
        res.status(409).send(`Status code: 409\n Error creating user.`);
    }
});

// Delete user.
router.delete('/user/:id', async (req, res) => {
   
});

// Update user.
router.patch('/user/:id', async (req, res) => {
    
});

module.exports = router;