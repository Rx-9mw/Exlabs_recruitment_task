const express = require('express');
const router = express.Router();
const User = require('../Models/user_model.js');

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
        res.status(409).send(error);
    }
});

module.exports = router;