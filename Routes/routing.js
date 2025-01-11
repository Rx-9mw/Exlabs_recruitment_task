const express = require('express');
const url = require('url');
const router = express.Router();
const User = require('../Models/user_model.js');

// Get all users.
router.get('/users', async (req, res) => {
    try {
        if(req.query.role) {
            // Check if role is correct.
            if(req.query.role !== 'admin' && req.query.role !== 'user') {
                return res.status(400).send('Users not found, role must be either admin or user.');
            }
            // if role parameter exists find all users with the role and exclude the mongoDB's _id field.
            const users = await User.find({ role: req.query.role }, { _id: 0 });
            res.status(200).send(users);
        } else {
            // Find all users and exclude the mongoDB's _id field.
            const users = await User.find({}, { _id: 0 });
            res.status(200).send(users);
        }
    } catch (error) {
        // If there is an error, send status code 500 and error message
        res.status(500).send('Error retrieving users.');
    }
});

// Add user to database.
router.post('/user', async (req, res) => {
    if(!req.body.id || !req.body.email || !req.body.role) {
        return res.status(400).send('Please include required fields (id, email, role).');
    }
    try {
        req.body.firstName = req.body.firstName || "";
        req.body.lastName = req.body.lastName || "";
        const user = new User({
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
        });
        await user.save();
        res.status(201).send('User created successfully.');
    } catch (error) {
        res.status(409).send('Error creating user. Duplicate email.');
    }
});

module.exports = router;