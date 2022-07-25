module.exports = app => {
  const surveys = require("../controllers/survey.controller.js");
  var router = require("express").Router();
  // Create a new Survey
  router.post("/", surveys.create);  
  // Retrieve all Surveys
  router.get("/", surveys.findAll);
  router.get("/byuser/:id", surveys.findAllSurveysByUser);
  // Retrieve a single Survey with id
  router.get("/:id", surveys.findOne);
  // Update a Survey with id
  router.put("/:id", surveys.update);
  // Delete a Survey with id
  router.delete("/:id", surveys.delete);
  // Delete all Surveys
  router.delete("/", surveys.deleteAll);
  app.use('/api/surveys', router);
};