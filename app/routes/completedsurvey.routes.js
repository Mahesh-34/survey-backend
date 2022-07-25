module.exports = app => {
  const surveys = require("../controllers/completedsurvey.controller.js");
  var router = require("express").Router();
  // Create a new Survey
  router.post("/", surveys.create);  
  // Retrieve all Surveys
  router.get("/", surveys.findAll);
  // Retrieve a single Survey with id
  router.get("/:id", surveys.findOne);  
  router.get("/byuser/:id", surveys.findAllSurveysByUser);  
  router.get("/byquestion/:id", surveys.findAllSurveysByQuestion);
  // Update a Survey with id
  router.put("/:id", surveys.update);
  // Delete a Survey with id
  router.delete("/:id", surveys.delete);
  // Delete all Surveys
  router.delete("/", surveys.deleteAll);
  app.use('/api/completedsurveys', router);
};