require("dotenv").config();
const User = require("../Models/user_model.js");

// Checking if user with the Id is already in the database.
async function duplicateIdCheck(Id) {
  // Pull from database based on Id.
  const userId = await User.findOne({ _id: Id }, { __v: 0 });
  // Check if the database returned any values.
  if (userId) {
    return true;
  }
  return false;
}

// Checking if user with the is already in the database.
async function duplicateEmailCheck(Email) {
  // Pull from database based on Email.
  const userEmail = await User.findOne({ email: Email }, { __v: 0 });
  // Check if the database returned any values.
  if (userEmail) {
    return true;
  }
  return false;
}

// Comparing the API_KEY from request to the API_KEY in environment variables.
function checkAPIKey(req, res, next) {
  if (req.query.API_KEY !== process.env.API_KEY) {
    return res.status(401).send("Unauthorized");
  }

  next();
}

module.exports = { duplicateIdCheck, duplicateEmailCheck, checkAPIKey };
