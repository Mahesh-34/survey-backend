module.exports = app => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();
  // Create a new User
  router.post("/", users.create);  
  router.post("/forgot-password", users.forgotPassword);
  router.post("/reset-password", users.resetPassword);
  router.post("/verify-email", users.verifyEmail);
  router.post("/sendemail-verification", users.sendEmailVerification);
  router.post("/login", users.login);
  router.post("/session", users.validateSession);
  // Retrieve all Users
  router.get("/", users.findAll);
  // Retrieve a single User with id
  router.get("/:id", users.findOne);
  // Update a User with id
  router.put("/:id", users.update);
  // Delete a User with id
  router.delete("/:id", users.delete);
  // Delete all Users
  router.delete("/", users.deleteAll);
  app.use('/api/users', router);
};