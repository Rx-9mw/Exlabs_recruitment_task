const express = require("express");
const router = express.Router();
const User = require("../Models/user_model.js");
const {
  duplicateIdCheck,
  duplicateEmailCheck,
  checkAPIKey,
} = require("../Middleware/middleware.js");

// Get all users.
router.get("/users", async (req, res) => {
  try {
    // Check if role is specified in the request.
    if (req.query.role) {
      // Check if role is correct.
      if (req.query.role !== "admin" && req.query.role !== "user") {
        return res
          .status(400)
          .send(
            "Status code: 400\n Users not found, role must be either admin or user.",
          );
      }
      // If role parameter exists find all users with the role and exclude the mongoDB's __v field.
      const users = await User.find({ role: req.query.role }, { __v: 0 });
      res.status(200).send(users);
    } else {
      // Find all users and exclude the mongoDB's __v field.
      const users = await User.find({}, { __v: 0 });
      res.status(200).send(users);
    }
  } catch (error) {
    console.error(error);
    // If there is an error, send status code 500 and error message
    res.status(500).send("Status code: 500\n Error retrieving users.");
  }
});

// Get user by id.
router.get("/user/:id", async (req, res) => {
  // Check if user is in database.
  if (!(await duplicateIdCheck(req.params.id))) {
    return res
      .status(404)
      .send("Status code 404\n User with this id does not exist.");
  }

  try {
    // Find user, exclude the mongoDB's __v field and send response.
    const user = await User.findOne({ _id: req.params.id }, { __v: 0 });
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    // If user with the id has not been found, send status code 404 and error message.
    res.status(500).send(`Status code: 500\n Error retrieving user.`);
  }
});

// Add user to database.
router.post("/user", async (req, res) => {
  // Check if email is not empty.
  if (req.body.email === "") {
    return res
      .status(400)
      .send(`Status code: 400\n Fields email and role should not be empty.`);
  }
  // Check if request body has at least one paremeter of user to change.
  if (!req.body.email || !req.body.role) {
    return res
      .status(400)
      .send(`Status code: 400\n Please include required fields (email, role).`);
  }
  // Check if the user role is admin or user.
  if (req.body.role !== "user") {
    if (req.body.role !== "admin") {
      return res
        .status(400)
        .send(
          "Status code: 400\n The role of the user can only be admin or user.",
        );
    }
  }
  // Check if user with this email is already in the database.
  if (await duplicateEmailCheck(req.body.email)) {
    return res
      .status(409)
      .send(`Status code: 409\n User with this email already exists.`);
  }

  try {
    /* MongoDB saves empty values as a string with 0 inside it. Because I wanted it to be completely
        empty, I'm overwriting the value with an empty string if first name or last name has not been
        specified in the request. */
    req.body.firstName = req.body.firstName || "";
    req.body.lastName = req.body.lastName || "";
    // Creating new user for MongoDB using the model.
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
    });
    // Saving the object to the database and sending the response.
    await user.save();
    res.status(201).send(`Status code: 201\n User created successfully.`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Status code: 500\n Error creating user.`);
  }
});

// Update user.
router.patch("/user/:id", async (req, res) => {
  const dataToUpdate = {};
  // Check if role exists and is either user or admin.
  if (req.body.role) {
    if (req.body.role !== "user") {
      if (req.body.role !== "admin") {
        return res
          .status(400)
          .send(
            "Status code: 400\n The role of the user can only be admin or user.",
          );
      }
    }
  }
  // Check if user with the id exists.
  if (!(await duplicateIdCheck(req.params.id))) {
    return res
      .status(404)
      .send("Status Code: 404\n User with this id does not exist.");
  }
  // Check if one of the values is provided.
  if (!req.body.firstName && !req.body.lastName && !req.body.role) {
    return res
      .status(400)
      .send(
        "Status Code: 400\n Please provide at least one of the requested properties (first name, last name, role).",
      );
  }
  // Loop through the request body and pull out only the needed values.
  for (const [key, value] of Object.entries(req.body)) {
    if (
      (key === "firstName" || key === "lastName" || key === "role") &&
      value
    ) {
      dataToUpdate[key] = value;
    }
  }

  try {
    // Update user using data pulled from the request.
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: dataToUpdate,
      },
    );

    res.status(200).send(`Status code: 200\n User updated.`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Status code: 500\n Error updating user.");
  }
});

// Delete user.
router.delete("/user/:id", async (req, res) => {
  // Check if user with the id exists.
  if (!(await duplicateIdCheck(req.params.id))) {
    return res
      .status(404)
      .send("Status Code: 404\n User with this id does not exist.");
  }

  try {
    // Delete user with the id.
    await User.deleteOne({ _id: req.params.id });
    res.status(200).send("Status code: 200\n User deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Status code: 500\n Error deleting user.");
  }
});

module.exports = router;
