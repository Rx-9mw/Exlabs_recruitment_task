require('dotenv').config();
const User = require('../Models/user_model.js');

// Checking if user with the Id or Email is already in the database.
async function duplicateUserCheck (req, res, next) {
    // Pull from database based on Id and Email.
    const userId = await User.findOne({ id: req.body.id }, { _id: 0, __v: 0 });
    const userEmail = await User.findOne({ email: req.body.email }, { _id: 0, __v: 0 });
    // Check if the database returned any values.
    if(userId) {
        return res.status(409).send('User with this id already exists');
    }
    if(userEmail) {
        return res.status(409).send('User with this email alerady exists');
    }

    next();
}

// Comparing the API_KEY from request to the API_KEY in environment variables.
function checkAPIKey(req, res, next) {
    if(req.query.API_KEY !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }
    
    next();
}

module.exports = {duplicateUserCheck, checkAPIKey};