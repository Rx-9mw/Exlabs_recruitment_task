require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const userRoutes = require('./Routes/routing.js');
const { duplicateIdCheck, duplicateEmailCheck, checkAPIKey }  = require('./Middleware/middleware.js');

// Connect to MongoDB
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

// Notify about connection if successful.
db.once('open', () => {
    console.log('Connected to Database.');
});

// Notify about connection if unsuccessful.
db.on('error', (error) => {
    console.log('Connection to the database unsuccessful.', error);
});

// Parsing JSON data for PATCH and POST requests.
app.use(express.json());

app.use( '/api', checkAPIKey, userRoutes);

// If route is different from /api send message.
app.get('/*', (req, res) => {
    res.send('Specified route does not exist.');
});

app.listen(process.env.API_PORT, () => {
    console.log(`Server is running on port ${process.env.API_PORT}`);
});
