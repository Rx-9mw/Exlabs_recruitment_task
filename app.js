require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const userRoutes = require('./Routes/routing.js');

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@users.hunzc.mongodb.net/?retryWrites=true&w=majority&appName=Users`);
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to Database.');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json());

app.use( '/api', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
