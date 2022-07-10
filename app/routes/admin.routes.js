module.exports = app => {
  const admins = require("../controllers/admin.controller.js");
  var router = require("express").Router();
  // Create a new Admin
  router.post("/", admins.create);  
  router.post("/forgot-password", admins.forgotPassword);
  router.post("/reset-password", admins.resetPassword);
  router.post("/verify-email", admins.verifyEmail);
  router.post("/sendemail-verification", admins.sendEmailVerification);
  router.post("/login", admins.login);
  router.post("/session", admins.validateSession);
  // Retrieve all Admins
  router.get("/", admins.findAll);
  // Retrieve a single Admin with id
  router.get("/:id", admins.findOne);
  // Update a Admin with id
  router.put("/:id", admins.update);
  // Delete a Admin with id
  router.delete("/:id", admins.delete);
  // Delete all Admins
  router.delete("/", admins.deleteAll);
  app.use('/api/admins', router);
};